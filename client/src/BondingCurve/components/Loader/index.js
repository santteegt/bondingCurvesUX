import React from "react";
import styles from "./loader.module.scss";

const Loader = ({ height }) => (
    <div className={styles.loader} style={{ minHeight: height }}>
        <div className={styles.drop} />
    </div>
);

export default Loader;