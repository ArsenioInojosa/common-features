﻿using Serenity.Services;
using MyRequest = Serenity.Services.ListRequest;
using MyResponse = Serenity.Services.ListResponse<Serenity.Demo.Northwind.Entities.CustomerRow>;
using MyRow = Serenity.Demo.Northwind.Entities.CustomerRow;

namespace Serenity.Demo.Northwind
{
    public interface ICustomerListHandler : IListHandler<MyRow, MyRequest, MyResponse> {}

    public class CustomerListHandler : ListRequestHandler<MyRow, MyRequest, MyResponse>, ICustomerListHandler
    {
        public CustomerListHandler(IRequestContext context)
             : base(context)
        {
        }
    }
}