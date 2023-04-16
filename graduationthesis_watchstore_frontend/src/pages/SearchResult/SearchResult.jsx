import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import ProductByCategory from '../../components/ProductByCategory/ProductByCategory';
import { changeProgress } from '../../features/loader';
import axiosClient from '../../api/axiosClient';
// import usePageTitle from '~/hooks/usePageTitle';
import style from './SearchResult.module.scss';
import MyBreadcrumb from '../../components/Breadcrumb/MyBreadcrumb';

const cx = classNames.bind(style);

function SearchResult() {
    // usePageTitle(`${location.state.keyword} - ${t('search.searchResult')}`);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [products, setProducts] = useState([]);
    const [displayKeyword, setDisplayKeyword] = useState('');
    const fetchStatus = useSelector(state => state.loader.progress);

    useEffect(() => {
        dispatch(changeProgress(50));
        fetchDataSearch();
        setDisplayKeyword(location.search.split('=')[1]);
        dispatch(changeProgress(100));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const fetchDataSearch = async () => {
        const query = location.search.split('=')[1];
        const res = await axiosClient.get('product/search', { params: { search: query } });
        setProducts(res.data.products);
    };
    return (
        <main className={cx('search-page')}>
            <div className={cx('container')}>
                <MyBreadcrumb />
                {(fetchStatus === 0 || fetchStatus === 100) && (
                    <>
                        {products.length > 0 ? (
                            <ProductByCategory
                                title={`${t('search.searchResult')}: "${displayKeyword}"`}
                                listProduct={products}
                            />
                        ) : (
                            <h2 className={cx('not-found')}>
                                {t('search.noResult')} "{displayKeyword}"
                            </h2>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

export default SearchResult;
