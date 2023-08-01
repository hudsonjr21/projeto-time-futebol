import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../components/styles/order.module.scss';
import { ListItem } from '../../components/ListGameDetail/index';
import { setupAPIClient } from '../../services/api'
import { FaTrash } from 'react-icons/fa';
import { ModalOrder } from '@/src/components/ModalGame';

export type CategoryProps = {
  id: string;
  name: string;
};

export type ProductProps = {
  id: string;
  name: string;
};

export type ItemProps = {
  id: string;
  product_id: string;
  name: string;
  amount: string | number;
};

export default function Order() {
  const router = useRouter();
  const { number, order_id } = router.query;

  const [category, setCategory] = useState<CategoryProps[]>([]);
  const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

  const [products, setProducts] = useState<ProductProps[]>([]);
  const [productSelected, setProductSelected] = useState<ProductProps | undefined>();
  const [modalProductVisible, setModalProductVisible] = useState(false);

  const [amount, setAmount] = useState('1');
  const [items, setItems] = useState<ItemProps[]>([]);

  const apiClient = setupAPIClient();

  useEffect(() => {
    async function loadInfo() {

      const response = await apiClient.get('/team');

      setCategory(response.data);
      setCategorySelected(response.data[0]);
    }

    loadInfo();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      if (categorySelected) {
        const response = await apiClient.get('/category/product', {
          params: {
            category_id: categorySelected.id,
          },
        });

        setProducts(response.data);
        setProductSelected(response.data[0]);
      }
    }

    loadProducts();
  }, [categorySelected]);

  async function handleCloseOrder() {
    try {
      await apiClient.delete('/order', {
        params: {
          order_id,
        },
      });

      router.push('/');
    } catch (err) {
      console.log(err);
    }
  }

  function handleChangeCategory(item: CategoryProps) {
    setCategorySelected(item);
  }

  function handleChangeProduct(item: ProductProps) {
    setProductSelected(item);
  }

  async function handleAdd() {
    if (productSelected) {
      const response = await apiClient.post('/order/add', {
        order_id,
        product_id: productSelected.id,
        amount: Number(amount),
      });

      let data = {
        id: response.data.id,
        product_id: productSelected.id,
        name: productSelected.name,
        amount,
      };

      setItems((oldArray) => [...oldArray, data]);
    }
  }

  async function handleDeleteItem(item_id: string) {
    await apiClient.delete('/order/remove', {
      params: {
        item_id,
      },
    });

    let removeItem = items.filter((item) => {
      return item.id !== item_id;
    });

    setItems(removeItem);
  }

  function handleFinishOrder() {
    router.push(`/finishOrder?number=${number}&order_id=${order_id}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Mesa {number}</div>
        {items.length === 0 && (
          <button onClick={handleCloseOrder}>
            <FaTrash name="trash-2" size={28} color="#FF3F4b" />
          </button>
        )}
      </div>

      {category.length !== 0 && (
        <button className={styles.input} onClick={() => setModalCategoryVisible(true)}>
          <div style={{ color: '#FFF' }}>{categorySelected?.name}</div>
        </button>
      )}

      {products.length !== 0 && (
        <button className={styles.input} onClick={() => setModalProductVisible(true)}>
          <div style={{ color: '#FFF' }}>{productSelected?.name}</div>
        </button>
      )}

      <div className={styles.qtdContainer}>
        <div className={styles.qtdText}>Quantidade</div>
        <input
          className={[styles.input, { width: '60%', textAlign: 'center' }]}
          placeholderTextColor="#F0F0F0"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.buttonAdd} onClick={handleAdd}>
          <div className={styles.buttonText}>+</div>
        </button>

        <button
          className={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
          disabled={items.length === 0}
          onClick={handleFinishOrder}
        >
          <div className={styles.buttonText}>Avançar</div>
        </button>
      </div>

      <div>
        {items.map((item) => (
          <ListItem key={item.id} data={item} deleteItem={handleDeleteItem} />
        ))}
      </div>

      <ModalOrder
        transparent={true}
        visible={modalCategoryVisible}
        handleCloseModal={() => setModalCategoryVisible(false)}
        options={category}
        selectedItem={handleChangeCategory}
      />

      <ModalOrder
        transparent={true}
        visible={modalProductVisible}
        handleCloseModal={() => setModalProductVisible(false)}
        options={products}
        selectedItem={handleChangeProduct}
      />
    </div>
  );
}
