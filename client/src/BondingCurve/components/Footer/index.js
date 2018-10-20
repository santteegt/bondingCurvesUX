import React from "react";
import styles from "./footer.module.scss";
import PropTypes from "prop-types";

const Footer = ({ detail, children }) => (
    <div className={styles.bondingcurve_module__footer}>
        <div className={styles.data_point_detail}>
            {
                detail && (
                    <>
                        {
                            detail.title && <div className={styles.data_point_detail__title}>{detail.title}</div>
                        }
                        {
                            detail.sub && <div className={styles.data_point_detail__date}>{detail.sub}</div>
                        }
                    </>
                )
            }
        </div>
        <div>
            {
                children ? children : null
            }
        </div>
    </div>
)

Footer.propTypes = {
    detail: PropTypes.shape({
        title: PropTypes.string,
        sub: PropTypes.string,
    }),
    children: PropTypes.any
}

export default Footer;