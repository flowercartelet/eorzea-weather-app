import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LanguageIcon from '@material-ui/icons/Language';
import MenuIcon from '@material-ui/icons/Menu';
import { useLocale } from '@react-aria/i18n';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { forwardRef, useCallback, useState } from 'react';
import { AVAILABLE_LOCALES } from '../constants';
import AppDrawer from './AppDrawer';
import EorzeaClock from './EorzeaClock';

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      color: 'inherit',
      textDecoration: 'none',
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(2),
      },
    },
    flex: {
      flex: 1,
    },
  }),
);

const MenuItemLink = forwardRef(
  ({ as, children, href, prefetch, ...props }, ref) => (
    <Link as={as} href={href} prefetch>
      <a {...props} ref={ref}>
        {children}
      </a>
    </Link>
  ),
);

MenuItemLink.propTypes = {
  as: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  prefetch: PropTypes.bool.isRequired,
};

const AppHeader = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { locale } = useLocale();
  const router = useRouter();
  const classes = useStyles();

  const handleDrawerClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleLanguageIconClick = useCallback(({ currentTarget }) => {
    setAnchorEl(currentTarget);
  }, []);

  const handleMenuIconClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const isHome = router.pathname === '/[locale]';

  return (
    <>
      <AppBar
        className={classes.appBar}
        elevation={isHome ? 0 : 4}
        position="fixed"
      >
        <Toolbar>
          <IconButton color="inherit" onClick={handleMenuIconClick}>
            <MenuIcon />
          </IconButton>
          <Typography
            className={classes.flex}
            color="inherit"
            noWrap
            variant="h6"
          >
            {!isHome && (
              <Link as={`/${locale}`} href="/[locale]" prefetch={false}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className={classes.title}>Eorzea Weather</a>
              </Link>
            )}
          </Typography>
          {router.asPath.startsWith(`/${locale}`) && (
            <>
              <IconButton color="inherit" onClick={handleLanguageIconClick}>
                <LanguageIcon />
              </IconButton>
              <Menu
                MenuListProps={{
                  component: 'div',
                }}
                anchorEl={anchorEl}
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'top',
                }}
                onClose={handleMenuClose}
                open={!!anchorEl}
                transformOrigin={{
                  horizontal: 'right',
                  vertical: 'top',
                }}
              >
                {Object.entries(AVAILABLE_LOCALES).map(
                  ([availableLocale, label]) => (
                    <MenuItem
                      as={`/${availableLocale}${router.asPath.replace(
                        /^\/[^/]+/,
                        '',
                      )}`}
                      component={MenuItemLink}
                      href={router.pathname}
                      hrefLang={availableLocale}
                      key={`item-${availableLocale}`}
                      lang={availableLocale}
                      onClick={handleMenuClose}
                      prefetch={false}
                      selected={availableLocale === locale}
                    >
                      {label}
                    </MenuItem>
                  ),
                )}
              </Menu>
            </>
          )}
          <EorzeaClock />
        </Toolbar>
      </AppBar>
      <Toolbar />
      <AppDrawer onClose={handleDrawerClose} open={open} />
    </>
  );
};

export default AppHeader;
