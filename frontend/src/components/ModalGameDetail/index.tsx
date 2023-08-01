import { useState } from 'react';
import { CategoryProps } from '../../pages/Order';
import styles from '../styles/modalPicker.module.scss';

interface ModalPickerProps {
  options: CategoryProps[];
  handleCloseModal: () => void;
  selectedItem: (item: CategoryProps) => void;
}

export function ModalPicker({ options, handleCloseModal, selectedItem }: ModalPickerProps) {
  const [selected, setSelected] = useState<CategoryProps | null>(null);

  function onPressItem(item: CategoryProps) {
    setSelected(item);
    selectedItem(item);
    handleCloseModal();
  }

  const option = options.map((item, index) => (
    <button key={index} className={styles.option} onClick={() => onPressItem(item)}>
      <div className={styles.item}>{item?.name}</div>
    </button>
  ));

  return (
    <div className={styles.container} onClick={handleCloseModal}>
      <div className={styles.content}>
        <div className={styles.scrollView}>{option}</div>
      </div>
    </div>
  );
}
