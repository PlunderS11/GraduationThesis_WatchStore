import classNames from 'classnames/bind';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import style from './Search.module.scss';

const cx = classNames.bind(style);

function Search({ customClass }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState('');

    const handleSearchClick = e => {
        if (e.type === 'click' || (e.type === 'keydown' && e.code === 'Enter')) {
            // dispatch(setKeywordValue(keyword));
            setKeyword('');
            navigate(`/search?name=${keyword}`, { state: { keyword } });
        }
    };

    return (
        <div className={cx('searchBox', customClass?.['searchBox'])}>
            <input
                className={cx('searchInput', customClass?.['searchInput'])}
                type="text"
                name=""
                placeholder={t('search.placeHolder')}
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={ev => {
                    if (ev.code === 'Enter') {
                        navigate(`/search?name=${keyword}`, { state: { keyword } });
                        setKeyword('');
                    }
                }}
            />
            <button
                className={cx('searchButton', customClass?.['searchButton'])}
                href="#"
                onClick={e => handleSearchClick(e)}
            >
                {t('button.search')}
            </button>
        </div>
    );
}

export default Search;
