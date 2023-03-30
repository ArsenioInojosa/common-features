﻿import { StringEditor, AsyncLookupEditor, DateEditor, EmailAddressEditor, BooleanEditor, PrefixedContext } from "@serenity-is/corelib";
import { NotesEditor } from "@/Note/NotesEditor";
import { initFormType } from "@serenity-is/corelib/q";

export interface CustomerForm {
    CustomerID: StringEditor;
    CompanyName: StringEditor;
    ContactName: StringEditor;
    ContactTitle: StringEditor;
    Representatives: AsyncLookupEditor;
    Address: StringEditor;
    Country: AsyncLookupEditor;
    City: AsyncLookupEditor;
    Region: StringEditor;
    PostalCode: StringEditor;
    Phone: StringEditor;
    Fax: StringEditor;
    NoteList: NotesEditor;
    LastContactDate: DateEditor;
    LastContactedBy: AsyncLookupEditor;
    Email: EmailAddressEditor;
    SendBulletin: BooleanEditor;
}

export class CustomerForm extends PrefixedContext {
    static formKey = 'Northwind.Customer';
    private static init: boolean;

    constructor(prefix: string) {
        super(prefix);

        if (!CustomerForm.init)  {
            CustomerForm.init = true;

            var w0 = StringEditor;
            var w1 = AsyncLookupEditor;
            var w2 = NotesEditor;
            var w3 = DateEditor;
            var w4 = EmailAddressEditor;
            var w5 = BooleanEditor;

            initFormType(CustomerForm, [
                'CustomerID', w0,
                'CompanyName', w0,
                'ContactName', w0,
                'ContactTitle', w0,
                'Representatives', w1,
                'Address', w0,
                'Country', w1,
                'City', w1,
                'Region', w0,
                'PostalCode', w0,
                'Phone', w0,
                'Fax', w0,
                'NoteList', w2,
                'LastContactDate', w3,
                'LastContactedBy', w1,
                'Email', w4,
                'SendBulletin', w5
            ]);
        }
    }
}