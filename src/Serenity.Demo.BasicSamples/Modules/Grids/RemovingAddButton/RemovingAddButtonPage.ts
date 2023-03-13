﻿import { Decorators, ToolButton } from "@serenity-is/corelib";
import { indexOf, initFullHeightGridPage } from "@serenity-is/corelib/q";
import { SupplierGrid } from "@serenity-is/demo.northwind";

export default function pageInit() {
    initFullHeightGridPage(new RemovingAddButton($('#GridDiv')).element);
}

@Decorators.registerClass('Serenity.Demo.BasicSamples.RemovingAddButton')
export class RemovingAddButton extends SupplierGrid {

    constructor(container: JQuery) {
        super(container);
    }

    /**
     * This method is called to get list of buttons to be created.
     */
    protected getButtons(): ToolButton[] {

        // call base method to get list of buttons
        // by default, base entity grid adds a few buttons, 
        // add, refresh, column selection in order.
        var buttons = super.getButtons();

        // here is several methods to remove add button
        // only one is enabled, others are commented

        // METHOD 1
        // we would be able to simply return an empty button list,
        // but this would also remove all other buttons
        // return [];

        // METHOD 2
        // remove by splicing (something like delete by index)
        // here we hard code add button index (not nice!)
        // buttons.splice(0, 1);

        // METHOD 3 - recommended
        // remove by splicing, but this time find button index
        // by its css class. it is the best and safer method
        buttons.splice(indexOf(buttons, x => x.cssClass == "add-button"), 1);

        return buttons;
    }
}