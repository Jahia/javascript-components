import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import {compose} from 'recompose';

const styles = () => ({
    listContainer: {
        flex: '1 0 0%',
        overflow: 'auto',
        width: '260px'
    },
    list: {
        width: 'fit-content',
        minWidth: '100%'
    }
});

const NodeTreesCmp = ({path, rootPath, siteKey, classes, nodeTreeConfigs, setRefetch, children}) => {
    const root = rootPath || '/sites/' + siteKey;
    const usedPath = path.startsWith(root) ? path : root;

    return (
        <div className={classes.listContainer}>
            <div className={classes.list}>
                {nodeTreeConfigs.map(nodeTreeConfig => (
                    <React.Fragment key={nodeTreeConfig.key}>
                        {children({
                            path: usedPath,
                            rootPath: nodeTreeConfig.rootPath.startsWith(root) ? nodeTreeConfig.rootPath : root + nodeTreeConfig.rootPath,
                            selectableTypes: nodeTreeConfig.selectableTypes,
                            dataCmRole: nodeTreeConfig.key,
                            openableTypes: nodeTreeConfig.openableTypes,
                            rootLabel: nodeTreeConfig.rootLabel,
                            setRefetch: refetchingData => setRefetch ? setRefetch(nodeTreeConfig.key, refetchingData) : undefined
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

NodeTreesCmp.defaultProps = {
    rootPath: undefined,
    setRefetch: null
};

NodeTreesCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    siteKey: PropTypes.string.isRequired,
    nodeTreeConfigs: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.func.isRequired,
    rootPath: PropTypes.string,
    setRefetch: PropTypes.func
};

export const NodeTrees = compose(
    withStyles(styles, {withTheme: true})
)(NodeTreesCmp);
