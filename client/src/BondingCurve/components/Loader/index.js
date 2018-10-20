import React from "react";
import styles from "./loader.module.scss";
import PropTypes from "prop-types";

const Loader = ({ height }) => (
    <div className={styles.loader} style={{ minHeight: height }}>
        <div className={styles.drop} />
    </div>
);

Loader.propTypes = {
    height: PropTypes.number
}

export default Loader;