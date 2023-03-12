import classNames from 'classnames/bind';

import style from './ProductOption.module.scss';

const cx = classNames.bind(style);

const ProductOption = ({ title, options, type, current, onChose }) => {
    const handleChose = item => {
        onChose(type, { _id: item._id, name: item.name });
    };
    return (
        <div className={cx('option')}>
            <div className={cx('title')}>{title}</div>
            <div className={cx('option-contain')}>
                {options.map(item => (
                    <div
                        className={cx('option-item', { active: current?._id === item._id })}
                        key={item._id}
                        onClick={() => handleChose(item)}
                    >
                        <img src={JSON.parse(item.images)[0]} alt={item.name} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductOption;
