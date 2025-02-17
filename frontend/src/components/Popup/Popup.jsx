import React, { useEffect } from 'react';
import styles from './Popup.module.css';

function Popup(props) {
  useEffect(() => {
    // Disable background scroll when popup is open
    if (props.trigger) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; // Restore scroll when popup is closed
    }

    // Cleanup function to restore scroll behavior if the component is unmounted
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [props.trigger]);

  return props.trigger ? (
    <div className={styles.popup}>
        <div className={styles.popupInner}>
            <button className={styles.closeBtn} onClick={() => props.setTrigger(false)}><i className='bx bx-x'></i></button>
            {props.children}
        </div>
    </div>
  ) : null;
}

export default Popup;
