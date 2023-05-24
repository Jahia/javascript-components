import React from 'react';
import {withTranslation} from 'react-i18next';
import {IconButton, Table, TableFooter, TablePagination, TableRow, withStyles} from '@material-ui/core';
import {FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage} from '@material-ui/icons';
import PropTypes from 'prop-types';

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing.unit * 2.5
    }
});

class TablePaginationActionsCmp extends React.Component {
    constructor(props) {
        super(props);
        this.handleFirstPageButtonClick = this.handleFirstPageButtonClick.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
        this.handleLastPageButtonClick = this.handleLastPageButtonClick.bind(this);
    }

    handleFirstPageButtonClick(event) {
        this.props.onChangePage(event, 0);
    }

    handleBackButtonClick(event) {
        this.props.onChangePage(event, this.props.page - 1);
    }

    handleNextButtonClick(event) {
        this.props.onChangePage(event, this.props.page + 1);
    }

    handleLastPageButtonClick(event) {
        this.props.onChangePage(event,
            Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
        );
    }

    render() {
        const {classes, count, page, rowsPerPage} = this.props;

        return (
            <div className={classes.root}>
                <IconButton
                    disabled={page === 0}
                    aria-label="First Page"
                    data-jrm-role="table-pagination-button-first-page"
                    onClick={this.handleFirstPageButtonClick}
                >
                    <FirstPage/>
                </IconButton>
                <IconButton
                    disabled={page === 0}
                    aria-label="Previous Page"
                    onClick={this.handleBackButtonClick}
                >
                    <KeyboardArrowLeft/>
                </IconButton>
                <IconButton
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                    data-jrm-role="table-pagination-button-next-page"
                    onClick={this.handleNextButtonClick}
                >
                    <KeyboardArrowRight/>
                </IconButton>
                <IconButton
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                    onClick={this.handleLastPageButtonClick}
                >
                    <LastPage/>
                </IconButton>
            </div>
        );
    }
}

TablePaginationActionsCmp.propTypes = {
    onChangePage: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
};

const TablePaginationActions = withStyles(actionsStyles, {name: 'DxPaginationActions', withTheme: true})(TablePaginationActionsCmp);

class PaginationCmp extends React.Component {
    constructor(props) {
        super(props);
        this.onChangePage = this.onChangePage.bind(this);
    }

    onChangePage(event, page) {
        this.props.onChangePage(page);
    }

    render() {
        const {totalCount, pageSize, currentPage, onChangeRowsPerPage, labels} = this.props;
        return (
            <Table>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                        count={totalCount}
                        rowsPerPage={pageSize}
                        page={currentPage}
                        ActionsComponent={TablePaginationActions}
                        labelRowsPerPage={labels.labelRowsPerPage}
                        labelDisplayedRows={({from, to, count}) => `${from}-${to} ` + labels.of + ` ${count}`}
                        data-jrm-role="table-pagination"
                        onChangePage={this.onChangePage}
                        onChangeRowsPerPage={event => onChangeRowsPerPage(event.target.value)}
                    />
                    </TableRow>
                </TableFooter>
            </Table>
        );
    }
}

PaginationCmp.propTypes = {
    totalCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onChangeRowsPerPage: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        labelRowsPerPage: PropTypes.string.isRequired,
        of: PropTypes.string.isRequired
    })
};

export const Pagination = withTranslation()(PaginationCmp);
