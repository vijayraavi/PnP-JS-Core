"use strict";

export interface INavigationNode {
    Title: string;
    Url: string;
    Children: Array<INavigationNode>;
}
