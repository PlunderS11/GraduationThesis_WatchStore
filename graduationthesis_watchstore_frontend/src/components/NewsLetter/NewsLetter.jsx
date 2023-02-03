import React from 'react';
import classNames from 'classnames/bind';

import style from './NewsLetter.module.scss';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';

const cx = classNames.bind(style);

const NewsLetter = () => {
    const { t } = useTranslation();
    return (
        <div className={cx('newsletter')}>
            <h4 className={cx('title')}>{t('newsletter.newsletter')}</h4>
            <form className={cx('form')} spellCheck="false">
                <input type="text" name="email" placeholder={t('newsletter.newsletterPlaceholder')} />
                {/* {formik.touched.email && formik.errors.email && (
                    <span className={cx('form-error')}>{t(formik.errors.email)}</span>
                )} */}
                <Button customClass={style} type="submit">
                    {t('button.submitButton')}
                </Button>
            </form>
        </div>
    );
};

export default NewsLetter;
