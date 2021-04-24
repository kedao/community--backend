import React from 'react';

const tableProgress = () => {
    return (
        <div >
            载入中……
        </div>
    );
}

const tableNoData = () => {
    return (
        <div>
            没有数据以显示
        </div>
    );
}

export default {
    tableProgress,
    tableNoData,
};
