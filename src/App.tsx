import { useMemo, useState } from 'react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CProgress,
  CProgressBar,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import './App.css'

type ProductStatus = 'Healthy' | 'Low stock' | 'Backorder' | 'Review'

type Product = {
  sku: string
  name: string
  category: string
  stock: number
  reorder: number
  margin: number
  velocity: number
  status: ProductStatus
}

type Order = {
  id: string
  customer: string
  value: number
  channel: string
  state: 'Packed' | 'Picking' | 'Shipped'
}

const products: Product[] = [
  {
    sku: 'SK-1420',
    name: 'Field pack 28L',
    category: 'Travel',
    stock: 118,
    reorder: 60,
    margin: 42,
    velocity: 81,
    status: 'Healthy',
  },
  {
    sku: 'SK-2038',
    name: 'Carbon desk lamp',
    category: 'Home office',
    stock: 22,
    reorder: 40,
    margin: 37,
    velocity: 74,
    status: 'Low stock',
  },
  {
    sku: 'SK-3184',
    name: 'Modular organizer',
    category: 'Storage',
    stock: 0,
    reorder: 30,
    margin: 48,
    velocity: 67,
    status: 'Backorder',
  },
  {
    sku: 'SK-4112',
    name: 'Daily carry bottle',
    category: 'Outdoor',
    stock: 64,
    reorder: 35,
    margin: 31,
    velocity: 58,
    status: 'Review',
  },
]

const orders: Order[] = [
  { id: 'ORD-7219', customer: 'Ari Lane', value: 284, channel: 'Web', state: 'Picking' },
  { id: 'ORD-7220', customer: 'Nora Bell', value: 142, channel: 'Retail', state: 'Packed' },
  { id: 'ORD-7221', customer: 'Moss Studio', value: 940, channel: 'Wholesale', state: 'Shipped' },
]

const filters = ['All', 'Healthy', 'Low stock', 'Backorder', 'Review'] as const
type Filter = (typeof filters)[number]

const currency = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
})

function badgeColor(status: ProductStatus | Order['state']) {
  if (status === 'Healthy' || status === 'Shipped') return 'success'
  if (status === 'Backorder') return 'danger'
  if (status === 'Low stock' || status === 'Picking') return 'warning'
  return 'info'
}

function App() {
  const [filter, setFilter] = useState<Filter>('All')
  const [search, setSearch] = useState('')
  const [selectedSku, setSelectedSku] = useState(products[0].sku)
  const selected = products.find((product) => product.sku === selectedSku) ?? products[0]

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesFilter = filter === 'All' || product.status === filter
      const matchesSearch =
        !query ||
        [product.sku, product.name, product.category]
          .join(' ')
          .toLowerCase()
          .includes(query)

      return matchesFilter && matchesSearch
    })
  }, [filter, search])

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
  const lowStock = products.filter((product) => product.stock <= product.reorder).length
  const orderValue = orders.reduce((sum, order) => sum + order.value, 0)
  const averageMargin = Math.round(
    products.reduce((sum, product) => sum + product.margin, 0) / products.length,
  )

  return (
    <main className="stockroom-app">
      <CContainer fluid className="stockroom-shell">
        <div className="stockroom-topbar">
          <div>
            <p className="text-uppercase text-medium-emphasis fw-semibold mb-1">CoreUI admin</p>
            <h1>Stockroom</h1>
            <p className="text-medium-emphasis mb-0">Commerce operations console</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <CButton color="light">Refresh inventory</CButton>
            <CButton color="dark">Add product</CButton>
          </div>
        </div>

        <CRow className="g-4 mb-4">
          <CCol md={6} xl={3}>
            <CCard color="primary" textColor="white">
              <CCardBody>
                <div className="text-white-50">Units on hand</div>
                <div className="display-6 fw-semibold">{totalStock}</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={6} xl={3}>
            <CCard color="warning">
              <CCardBody>
                <div className="text-black-50">Restock watch</div>
                <div className="display-6 fw-semibold">{lowStock}</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={6} xl={3}>
            <CCard color="success" textColor="white">
              <CCardBody>
                <div className="text-white-50">Open order value</div>
                <div className="display-6 fw-semibold">{currency.format(orderValue)}</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={6} xl={3}>
            <CCard color="info" textColor="white">
              <CCardBody>
                <div className="text-white-50">Average margin</div>
                <div className="display-6 fw-semibold">{averageMargin}%</div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow className="g-4">
          <CCol xl={8}>
            <CCard>
              <CCardHeader className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <strong>Product control</strong>
                  <div className="small text-medium-emphasis">
                    Search inventory and review stock movement.
                  </div>
                </div>
                <CButtonGroup role="group" aria-label="Product filters">
                  {filters.map((item) => (
                    <CButton
                      color={filter === item ? 'dark' : 'secondary'}
                      key={item}
                      onClick={() => setFilter(item)}
                      variant={filter === item ? undefined : 'outline'}
                    >
                      {item}
                    </CButton>
                  ))}
                </CButtonGroup>
              </CCardHeader>
              <CCardBody>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Search</CInputGroupText>
                  <CFormInput
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Product, SKU, or category"
                  />
                </CInputGroup>
                <CTable align="middle" hover responsive>
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell>Product</CTableHeaderCell>
                      <CTableHeaderCell>Category</CTableHeaderCell>
                      <CTableHeaderCell>Stock</CTableHeaderCell>
                      <CTableHeaderCell>Reorder</CTableHeaderCell>
                      <CTableHeaderCell>Margin</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {visibleProducts.map((product) => (
                      <CTableRow key={product.sku} onClick={() => setSelectedSku(product.sku)}>
                        <CTableDataCell>
                          <div className="fw-semibold">{product.name}</div>
                          <div className="small text-medium-emphasis">{product.sku}</div>
                        </CTableDataCell>
                        <CTableDataCell>{product.category}</CTableDataCell>
                        <CTableDataCell>{product.stock}</CTableDataCell>
                        <CTableDataCell>{product.reorder}</CTableDataCell>
                        <CTableDataCell>{product.margin}%</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={badgeColor(product.status)}>{product.status}</CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol xl={4}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>{selected.name}</strong>
                <div className="small text-medium-emphasis">{selected.sku}</div>
              </CCardHeader>
              <CCardBody>
                <div className="d-flex justify-content-between mb-2">
                  <span>Sales velocity</span>
                  <strong>{selected.velocity}%</strong>
                </div>
                <CProgress className="mb-4">
                  <CProgressBar value={selected.velocity} color={badgeColor(selected.status)} />
                </CProgress>
                <div className="d-flex justify-content-between mb-2">
                  <span>Margin</span>
                  <strong>{selected.margin}%</strong>
                </div>
                <CProgress className="mb-4">
                  <CProgressBar value={selected.margin} color="info" />
                </CProgress>
                <CBadge color={badgeColor(selected.status)}>{selected.status}</CBadge>
              </CCardBody>
            </CCard>

            <CCard>
              <CCardHeader>
                <strong>Live orders</strong>
              </CCardHeader>
              <CCardBody className="stockroom-orders">
                {orders.map((order) => (
                  <div className="stockroom-order" key={order.id}>
                    <div>
                      <div className="fw-semibold">{order.id}</div>
                      <div className="small text-medium-emphasis">
                        {order.customer} · {order.channel}
                      </div>
                    </div>
                    <div className="text-end">
                      <div>{currency.format(order.value)}</div>
                      <CBadge color={badgeColor(order.state)}>{order.state}</CBadge>
                    </div>
                  </div>
                ))}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </main>
  )
}

export default App
