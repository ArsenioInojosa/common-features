﻿import { Decorators, confirmDialog, faIcon, htmlEncode, gridPageInit } from "@serenity-is/corelib";
import { CustomerGrid, CustomerService, OrderDialog, OrderRow } from "@serenity-is/demo.northwind";
import { Column } from "@serenity-is/sleekgrid";

export default () => gridPageInit(InlineActionGrid);

const deleteRowAction = "delete-row";
const viewDetailsAction = "view-details";
const newOrderAction = "new-order";

@Decorators.registerClass('Serenity.Demo.BasicSamples.InlineActionGrid')
export class InlineActionGrid extends CustomerGrid {

    protected getColumns() {
        var columns = super.getColumns();

        let inlineAction = (actionKey: string, hint, iconClass: string): Column => ({
            name: '',
            width: 24,
            format: _ => `<a class="inline-action" data-action="${actionKey}" title="${htmlEncode(hint)}"><i class="${htmlEncode(iconClass)}"></i></a>`,
            minWidth: 24,
            maxWidth: 24
        })

        columns.unshift(inlineAction(deleteRowAction, "Delete", faIcon("trash", "danger")));
        columns.splice(1, 0, inlineAction(viewDetailsAction, "View Details", faIcon("search")));
        columns.splice(2, 0, inlineAction(newOrderAction, "New Order", faIcon("cart-plus")));

        return columns;
    }

    protected onClick(e: Event, row: number, cell: number) {
        super.onClick(e, row, cell);

        if ((e as any).isDefaultPrevented?.() || e.defaultPrevented)
            return;

        var item = this.itemAt(row);
        var action = (e.target as HTMLElement).closest("inline-action")?.getAttribute("data-action");
        if (action) {
            e.preventDefault();

            switch (action) {
                case deleteRowAction: {
                    confirmDialog('Delete record?', () => {
                        CustomerService.Delete({
                            EntityId: item.ID,
                        }, _ => {
                            this.refresh();
                        });
                    });
                    break;
                }

                case viewDetailsAction: {
                    this.editItem(item.ID);
                    break;
                }

                case newOrderAction: {
                    var dlg = new OrderDialog();
                    this.initDialog(dlg);
                    dlg.loadEntityAndOpenDialog(<OrderRow>{
                        CustomerID: item.CustomerID
                    });
                }
            }
        }
    }
}