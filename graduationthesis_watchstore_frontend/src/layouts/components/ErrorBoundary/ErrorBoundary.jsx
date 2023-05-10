import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { images } from '../../../assets/images';
import { Divider, Image, Space } from 'antd';
import Button from '../../../components/Button/Button';
import { useTranslation } from 'react-i18next';

function ErrorFallback({ error, resetErrorBoundary }) {
    const { t } = useTranslation();
    return (
        <div style={{ textAlign: 'center' }}>
            <Space style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Image src={images.errorBoundary} width={300} preview={false} />
                <h2>{t('errorPage.title')}</h2>
                <div>{t('errorPage.fix')}</div>
                <span>{t('errorPage.description')}!</span>
                <Divider />
                <Button to="/">{t('button.goHome')}!</Button>
            </Space>
        </div>
    );
}

export default function MyErrorBoundary({ children }) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // reset state when error is recovered
            }}
        >
            {children}
        </ErrorBoundary>
    );
}
