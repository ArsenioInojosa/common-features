import { ResetPasswordForm } from "@/ServerTypes/Extensions/ResetPasswordForm";
import { ResetPasswordRequest } from "@/ServerTypes/Extensions/ResetPasswordRequest";
import { Texts } from "@/ServerTypes/Texts";
import { PropertyPanel, WidgetProps, informationDialog, resolveUrl, serviceCall, stringFormat } from "@serenity-is/corelib";
import { ResetPasswordResponse } from "../../ServerTypes/Extensions/ResetPasswordResponse";
import { AccountPanelTitle } from "../AccountPanelTitle";

export default function pageInit(opt: ResetPasswordOptions) {
    new ResetPasswordPanel({ element: '#PanelDiv', class: 's-full-page justify-content-center s-Form', ...opt });
}

interface ResetPasswordOptions {
    token: string;
    minPasswordLength: number;
}

const myTexts = Texts.Forms.Membership.ResetPassword;

export class ResetPasswordPanel extends PropertyPanel<ResetPasswordRequest, ResetPasswordOptions> {

    protected getFormKey() { return ResetPasswordForm.formKey; }

    private form = new ResetPasswordForm(this.idPrefix);
    private tokenInput: HTMLInputElement;

    constructor(props: WidgetProps<ResetPasswordOptions>) {
        super(props);

        this.form.NewPassword.addValidationRule(this.uniqueName, e => {
            if (this.form.NewPassword.value.length < this.options.minPasswordLength)
                return stringFormat(Texts.Validation.MinRequiredPasswordLength, this.options.minPasswordLength);
        });

        this.form.ConfirmPassword.addValidationRule(this.uniqueName, e => {
            if (this.form.ConfirmPassword.value !== this.form.NewPassword.value)
                return Texts.Validation.PasswordConfirmMismatch;
        });
    }

    submitClick() {
        if (!this.validateForm())
            return;

        var request = this.getSaveEntity();
        request.Token = this.tokenInput.value;
        serviceCall({
            url: resolveUrl('~/Account/ResetPassword'),
            request: request,
            onSuccess: (response: ResetPasswordResponse) => {
                if (response.RedirectHome)
                    window.location.href = resolveUrl('~/')
                else
                    informationDialog(myTexts.Success, () => {
                        window.location.href = resolveUrl('~/Account/Login');
                    });
            }
        });
    }

    renderContents() {
        const id = this.useIdPrefix();
        return (
            <div class="s-container-tight">
                <AccountPanelTitle />
                <div class="s-Panel p-4">
                    <h5 class="text-center mb-4">{myTexts.FormTitle}</h5>
                    <form id={id.Form} action="">
                        <div id={id.PropertyGrid}></div>
                        <button id={id.SubmitButton} type="submit" class="btn btn-primary mx-8 w-100"
                            onClick={e => { e.preventDefault(); this.submitClick(); }}>
                            {myTexts.SubmitButton}
                        </button>
                        <input type="hidden" value={this.options.token} ref={el => this.tokenInput = el} />
                    </form>
                </div>
            </div>
        );
    }
}