export const calculateSaleReturn = ({ totalSupply, poolBalance, reserveRatio, amount })  => {
    if (!totalSupply || !poolBalance || !reserveRatio || !amount) return 0;

    if (totalSupply === 0 || reserveRatio === 0 || poolBalance === 0 || amount === 0) return 0;
    if (amount === totalSupply) return poolBalance;
    if (reserveRatio === 1) return poolBalance;

    return poolBalance * (1 - (1 - (amount / totalSupply)) ** (1 / reserveRatio));
}

export const calculateBuyPrice = ({ totalSupply, poolBalance, reserveRatio, amount }) => {
    if (!totalSupply || !poolBalance || !reserveRatio || !amount) return 0;
    if (totalSupply === 0 || reserveRatio === 0 || poolBalance === 0 || amount === 0) return 0;

    return poolBalance * ((1 + (amount / totalSupply)) ** (1 / reserveRatio) - 1);
}