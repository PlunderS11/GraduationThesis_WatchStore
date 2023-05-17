import { PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '../../components/Button/Button';
import { useTranslation } from 'react-i18next';

export default function PaymentForm({ handleBuyOrder }) {
    const { t } = useTranslation();
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const data = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                // return_url: `${window.location.origin}/completion`,
            },
            redirect: 'if_required',
        });

        if (data.paymentIntent.status === 'succeeded') {
            setLoading(true);
            try {
                await handleBuyOrder();
            } catch (error) {
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
            <PaymentElement id="payment-element" />
            <button disabled={!stripe || !elements} id="submit" style={{ marginTop: '10px' }}>
                <Button loading={loading}>{t('button.order')}</Button>
            </button>
        </form>
    );
}
