import PropTypes from 'prop-types';
import React, {useState} from 'react';
import * as _ from 'lodash';
import {Menu, MenuItem} from '@material-ui/core';
import {Button} from '../Button';
import {Typography} from '../Typography';
import {ChevronDown} from 'mdi-material-ui';

const LanguageSwitcher = ({color, lang, languages, onSelectLanguage}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const uppercaseFirst = string => string.charAt(0).toUpperCase() + string.substr(1);

    return (
        <React.Fragment>
            {languages.length > 1 ? (
                <React.Fragment>
                    <Button aria-owns={anchorEl ? 'language-switcher' : null}
                            aria-haspopup="true"
                            data-cm-role="language-switcher"
                            size="compact"
                            color={color}
                            onClick={handleClick}
                    >
                        <Typography noWrap variant="zeta" color="inherit">
                            {uppercaseFirst(_.find(languages, language => language.language === lang).displayName)}
                            &nbsp;
                        </Typography>
                        <ChevronDown fontSize="small" color="inherit"/>
                    </Button>
                    <Menu id="language-switcher"
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                    >
                        {languages.map(language => (
                            <MenuItem
                                    key={language.language}
                                    selected={language.language === lang}
                                    onClick={() => {
                                        onSelectLanguage(language.language);
                                        handleClose();
                                    }}
                            >
                                {uppercaseFirst(language.displayName)}
                            </MenuItem>
                            ))}
                    </Menu>
                </React.Fragment>
            ) : (
                <Button aria-owns={anchorEl ? 'language-switcher' : null}
                        aria-haspopup="true"
                        data-cm-role="language-switcher"
                        size="compact"
                        color={color}
                        onClick={handleClick}
                >
                    <Typography noWrap variant="zeta" color="inherit">
                        {uppercaseFirst(_.find(languages, language => language.language === lang).displayName)}
                            &nbsp;
                    </Typography>
                </Button>
            )}
        </React.Fragment>
    );
};

LanguageSwitcher.propTypes = {
    color: PropTypes.string,
    lang: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelectLanguage: PropTypes.func.isRequired
};

LanguageSwitcher.defaultProps = {
    color: 'default'
};

LanguageSwitcher.displayName = 'LanguageSwitcher';

export default LanguageSwitcher;

