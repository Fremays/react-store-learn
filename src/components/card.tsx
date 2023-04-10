import React from 'react';
import {PropsWithChildren} from 'react';

interface CardProps extends PropsWithChildren {
    width?: string;
    height?: string;
}

const Card: React.FC<CardProps> =
    ({width, height, children}) => {
    return (
        <div style={{width, height, background: "gray"}}>
            <p>SSSSSSS</p>
            {children}
        </div>
    );
};

export default Card;