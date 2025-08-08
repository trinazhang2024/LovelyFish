import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; //useCart 是自定义 Hook，从购物车上下文拿到 dispatch 方法，操作购物车。
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap'; //React-Bootstrap 的 UI 组件，用于布局和样式。
import { BsStarFill, BsArrowRight } from 'react-icons/bs'; //react-icons 提供的图标。
import axios from 'axios'; //For sending network requests.
import './NewArrivals.css';

function NewArrivals() {
  const [products, setProducts] = useState([]); // New product list returned from the backend
  const [visibleCount, setVisibleCount] = useState(8); //Number of products currently displayed, initially 4 items
  const [loading, setLoading] = useState(true); //Loading status
  const [error, setError] = useState(null); //error info
  const { dispatch } = useCart(); //Use dispatch from the cart context to update the shopping cart. 从购物车上下文获取dispatch，操作购物车

  useEffect(() => {
    // Fetch product data from the backend API
    axios.get('https://localhost:7148/api/Product')
      .then(response => {
        console.log('products:', response.data); 
        const allProducts = response.data;

        // New arrivals are assumed to be the 8 products with the highest IDs, or selected based on a specific field.
        const newProducts = allProducts //组件挂载后，调用后端接口获取所有商品。
          .sort((a, b) => b.id - a.id) // Order by ID descending
          .slice(0, 8);               // Display the latest 8 items

        setProducts(newProducts);
        setLoading(false); //数据请求成功后保存到 products，关闭加载状态。
      })
      .catch(err => {
        console.error('Failed to load new products:', err);
        setError('Error loading new product data.');
        setLoading(false); //请求失败时，记录错误信息，并关闭加载状态。
      });
  }, []);

  const loadMore = () => setVisibleCount(prev => prev + 4); //点击“加载更多”按钮时，visibleCount 增加4，展示更多商品。

  const addToCart = (product) => {
    dispatch({
      type: 'ADD_ITEM',
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }
    });
    alert(`${product.name} Added to Cart`); //点击按钮时，向购物车上下文发送 ADD_ITEM 动作，把选中商品加入购物车并且弹窗提示商品已加入。
    
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading new products...</p>
      </Container>
    );
  } //加载中显示旋转加载动画和提示。

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  } //请求失败显示错误提示框。

  return (
    <Container className="my-5 new-arrivals-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">
          {/*顶部标题带星星图标“New Arrivals”} */}
          <BsStarFill className="text-warning me-2" />  
          New Arrivals
        </h2>
      </div>

      {products.length === 0 ? (
        <Alert variant="info">No new arrivals at the moment. Thanks！</Alert> //如果没新商品，显示提示“当前暂无新品”。
      ) : (
        <> 
          {/* {有新商品时，按网格布局（响应式）显示前 visibleCount 个商品卡片。} */}
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {products.slice(0, visibleCount).map(product => (
              <Col key={product.id}>
                <Card className="h-100 d-flex flex-column position-relative">
                  {/* If the backend does not have an isNew field, it can be determined whether to display "NEW" based on logic. */}
                  <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                    NEW
                  </Badge>

                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <Card.Img
                      variant="top"
                      src={product.image}
                      style={{ height: '250px', objectFit: 'cover', marginTop: '20px' }} 
                    />
                  </Link>
                  <Card.Body className="d-flex flex-column flex-grow-1 text-center">
                    <Card.Title className="h6">{product.name}</Card.Title>
                    <Card.Text className="text-danger fw-bold mt-1">
                      ${product.price}
                    </Card.Text>
                    <Button
                      variant="outline-primary"
                      style={{ cursor: 'pointer' }}
                      className="w-100 mt-auto"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {visibleCount < products.length && (
            <div className="text-center mt-4">
              <Button
                variant="outline-primary"
                onClick={loadMore}
                className="px-4"
              >
                Loading more <BsArrowRight className="ms-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default NewArrivals;

// 这个 NewArrivals 组件实现了：

// 从后端拉取最新的商品数据

// 显示最新的8个新品，默认先显示4个

// 支持“加载更多”分页展示

// 购物车功能：能将商品添加到购物车

// 友好的加载和错误状态展示

// 使用响应式 Bootstrap 网格布局展示商品卡片