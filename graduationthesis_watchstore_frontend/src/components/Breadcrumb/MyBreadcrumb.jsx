import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { publicRouter } from '../../routes';
import { useTranslation } from 'react-i18next';

const MyBreadcrumb = ({ urlParams, detail }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        var breadcrumbTemp = null;
        if (detail) {
            const find = publicRouter.find(e => e.path.split('/')[1] === location.pathname.split('/')[1]);
            const rs = find.breadcrumb.split('/');
            breadcrumbTemp = rs.reduce((acc, cur) => {
                return [...acc, <Link to={`/${cur}`}>{t(`breadcrumbs.${cur}`)}</Link>];
            }, []);
            setBreadcrumbs([...breadcrumbTemp, urlParams]);
        } else {
            const find = publicRouter.find(e => e.path === location.pathname);
            const rs = find.breadcrumb.split('/');
            breadcrumbTemp = rs.reduce((acc, cur) => {
                return [
                    ...acc,
                    cur === 'home' ? <Link to={`/${cur}`}>{t(`breadcrumbs.${cur}`)}</Link> : t(`breadcrumbs.${cur}`),
                ];
            }, []);
            setBreadcrumbs(breadcrumbTemp);
        }
    }, [location.pathname, detail, urlParams, t]);
    return (
        <Breadcrumb
            style={{ display: 'inline-block', marginBottom: 20, fontSize: 18 }}
            items={breadcrumbs.map(item => ({
                title: item,
            }))}
        />
    );
};

export default MyBreadcrumb;
