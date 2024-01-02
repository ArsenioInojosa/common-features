using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Serenity.Web.Providers;

namespace Serenity.Extensions;

public abstract class MembershipPageBase<TUserRow> : Controller
    where TUserRow: class, IRow, IIdRow, IEmailRow, IPasswordRow, new()
{

    protected virtual ActionResult Error(string message)
    {
        return View("~/Views/Errors/ValidationError.cshtml", new ValidationError(message));
    }

    protected virtual string ValidateNewPassword(string password, PasswordStrengthRulesSettings settings, ITextLocalizer localizer)
    {
        return ValidateNewPassword(password, HttpContext.RequestServices.GetRequiredService<IPasswordRuleValidator>());
    }

    protected virtual string ValidateNewPassword(string password, IPasswordRuleValidator passwordRuleValidator)
    {
        return passwordRuleValidator.ValidatePasswordStrengthRules(password);
    }

    protected virtual string GenerateSalt(PasswordStrengthRulesSettings settings)
    {
        return IO.TemporaryFileHelper.RandomFileCode()[..settings.SaltSize];
    }

    protected virtual string CalculateHash(string password, string salt)
    {
        return SiteMembershipProvider.ComputeSHA512(password + salt);
    }

    public static int GetDeterministicHashCode(string str)
    {
        unchecked
        {
            int hash1 = (5381 << 16) + 5381;
            int hash2 = hash1;

            for (int i = 0; i < str.Length; i += 2)
            {
                hash1 = ((hash1 << 5) + hash1) ^ str[i];
                if (i == str.Length - 1)
                    break;
                hash2 = ((hash2 << 5) + hash2) ^ str[i + 1];
            }

            return hash1 + (hash2 * 1566083941);
        }
    }

    protected virtual int GetNonceFor(TUserRow user)
    {
        return GetDeterministicHashCode(
            ((user as IUpdateLogRow)?.UpdateDateField[user] ??
             (user as IInsertLogRow)?.InsertDateField[user] ??
             DateTime.Today).ToString("s") +
             (user as IPasswordRow)?.PasswordHashField[user] +
             (user as IPasswordRow)?.PasswordSaltField[user]);
    }

    protected virtual string GetConnectionKey() => typeof(TUserRow).GetAttribute<ConnectionKeyAttribute>()?.Value ?? "Default";
}
