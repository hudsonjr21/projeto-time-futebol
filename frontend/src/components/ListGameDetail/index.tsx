import { FaTrash } from 'react-icons/fa';
import styles from '../ListGameDetail/styles.module.scss';

interface ItemProps {
  data: {
    id: string;
    product_id: string;
    name: string;
    amount: string | number;
  };
  deleteItem: (item_id: string) => void;
}

export function ListItem({ data, deleteItem }: ItemProps) {
  function handleDeleteItem() {
    deleteItem(data.id);
  }

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        {data.amount} - {data.name}
      </div>

      <button onClick={handleDeleteItem}>
        <FaTrash name="trash-2" color="#FF3F4b" size={25} />
      </button>
    </div>
  );
}
