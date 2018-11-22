import {createMuiTheme} from '@material-ui/core';
import {commonBaseThemeConfig} from "../common-base/config";
import * as _ from 'lodash';

import {shape} from "./shape";
import {typography} from "./typography";

// Overrides
import {dsAppBar} from "./overrides/appbar";
import {dsButton, dsButtonBase, dsIconButton} from "./overrides/button";
import {dsCard, dsCardContent, dsCardHeader} from "./overrides/card"
import {dsDialog, dsDialogActions, dsDialogTitle, dsDialogContent} from "./overrides/dialog";
import {dsDivider} from "./overrides/divider";
import {dsCheckbox} from "./overrides/checkbox";
import {dsInput} from "./overrides/input";
import {dsMenu, dsMenuItem} from "./overrides/menu";
import {dsPaper} from "./overrides/paper";
import {dsSelect} from "./overrides/select";
import {dsIcons} from "./overrides/icon";
import {dsTable, dsTableCell, dsTableRow, dsTablePagination} from "./overrides/table";
import {dsTab, dsTabs} from "./overrides/tabs";
import {dsToolBar} from "./overrides/toolbar";
import {dsListItem, dsListItemSecondaryAction, dsListItemText, dsListSubheader, dsListItemIcon} from "./overrides/list";
import {dsTypography} from "./overrides/typography";
import {dsFormControlLabel, dsFormLabel} from "./overrides/form";
import {dsPanel, dsPanelActions, dsPanelDetails} from "./overrides/panel";
import {dsChip} from "./overrides/chip";

// Import of Light Jahia DS palette
import { dsLightPalette } from "./light/palette";

// Import of Dark Jahia DS palette
import { dsPalette } from './overrides/palette.js'

// import of Jahia DS shadows
import { dsShadows } from './shadows.js';

const dsLightThemeConfig = {
    palette: dsLightPalette,
    shape,
    typography
};

const dsLightThemeOverrides = (theme) => ({
    MuiAppBar: dsAppBar(theme),
    MuiButton: dsButton(theme),
    MuiButtonBase: dsButtonBase(theme),
    MuiIconButton: dsIconButton(theme),
    MuiCard: dsCard(theme),
    MuiCardContent: dsCardContent(theme),
    MuiCardHeader: dsCardHeader(theme),
    MuiCheckbox: dsCheckbox(theme),
    MuiChip: dsChip(theme),
    MuiDialogTitle: dsDialogTitle(theme),
    MuiDialog: dsDialog(theme),
    MuiDialogActions: dsDialogActions(theme),
    MuiDialogContent: dsDialogContent(theme),
    MuiDivider: dsDivider(theme),
    MuiFormLabel: dsFormLabel(theme),
    MuiFormControlLabel: dsFormControlLabel(theme),
    MuiInput: dsInput(theme),
    MuiListItem: dsListItem(theme),
    MuiListItemSecondaryAction: dsListItemSecondaryAction,
    MuiListSubheader: dsListSubheader,
    MuiListItemText: dsListItemText,
    MuiMenu: dsMenu(theme),
    MuiMenuItem: dsMenuItem(theme),
    MuiExpansionPanel: dsPanel(theme),
    MuiExpansionPanelDetails: dsPanelDetails,
    MuiExpansionPanelActions: dsPanelActions(theme),
    MuiPaper: dsPaper(theme),
    MuiSelect: dsSelect(theme),
    MiuSvgIcon: dsIcons(theme),
    MuiTable: dsTable(theme),
    MuiTableRow: dsTableRow(theme),
    MuiTablePagination: dsTablePagination(theme),
    MuiTableCell: dsTableCell(theme),
    MuiTab: dsTab(theme),
    MuiTabs: dsTabs(theme),
    MuiToolbar: dsToolBar(theme),
    MuiTypography: dsTypography(theme)
});

const dsLightTheme = createMuiTheme(_.merge({}, commonBaseThemeConfig, dsLightThemeConfig));
_.merge(dsLightTheme, {overrides: dsLightThemeOverrides(dsLightTheme)});

const dsDarkThemeConfig = {
    palette: dsPalette,
    shape,
    typography,
    shadows : dsShadows
};

const dsDarkThemeOverrides = (theme) => ({
    MuiAppBar: dsAppBar(theme),
    MuiButton: dsButton(theme),
    MuiButtonBase: dsButtonBase(theme),
    MuiIconButton: dsIconButton(theme),
    MuiCard: dsCard(theme),
    MuiCardContent: dsCardContent(theme),
    MuiCardHeader: dsCardHeader(theme),
    MuiCheckbox: dsCheckbox(theme),
    MuiChip: dsChip(theme),
    MuiDialogTitle: dsDialogTitle(theme),
    MuiDialog: dsDialog(theme),
    MuiDialogActions: dsDialogActions(theme),
    MuiDialogContent: dsDialogContent(theme),
    MuiFormLabel: dsFormLabel(theme),
    MuiFormControlLabel: dsFormControlLabel(theme),
    MuiInput: dsInput(theme),
    MuiListItem: dsListItem(theme),
    MuiListItemIcon: dsListItemIcon,
    MuiListItemSecondaryAction: dsListItemSecondaryAction,
    MuiListSubheader: dsListSubheader,
    MuiListItemText: dsListItemText,
    MuiMenu: dsMenu(theme),
    MuiMenuItem: dsMenuItem(theme),
    MuiExpansionPanel: dsPanel(theme),
    MuiExpansionPanelDetails: dsPanelDetails,
    MuiExpansionPanelActions: dsPanelActions(theme),
    MuiPaper: dsPaper(theme),
    MuiSelect: dsSelect(theme),
    MiuSvgIcon: dsIcons(theme),
    MuiTable: dsTable(theme),
    MuiTableRow: dsTableRow(theme),
    MuiTableCell: dsTableCell(theme),
    MuiTab: dsTab(theme),
    MuiTabs: dsTabs(theme),
    MuiToolbar: dsToolBar(theme),
    MuiTypography: dsTypography(theme)
});

const dsDarkTheme = createMuiTheme(_.merge({}, commonBaseThemeConfig, dsDarkThemeConfig));
_.merge(dsDarkTheme, {overrides: dsDarkThemeOverrides(dsDarkTheme)});

export {dsLightTheme, dsDarkTheme}
