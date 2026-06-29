import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Archive,
  BarChart3,
  Boxes,
  CheckCircle2,
  PackagePlus,
  RefreshCcw,
  Search,
  ShoppingBag,
  Truck,
} from 'lucide-react'
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

const theme = {
  '--accent': '#0f766e',
  '--accent-2': '#2563eb',
  '--accent-3': '#eab308',
} as CSSProperties

function getStatusClass(status: ProductStatus | Order['state']) {
  if (status === 'Healthy' || status === 'Shipped') return 'good'
  if (status === 'Low stock' || status === 'Picking') return 'warn'
  if (status === 'Backorder') return 'bad'
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
    <main className="app" style={theme}>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">
              <Boxes size={22} aria-hidden="true" />
            </span>
            <div>
              <h1>Stockroom</h1>
              <p>Commerce operations console</p>
            </div>
          </div>
          <div className="toolbar">
            <button className="icon-button" type="button" aria-label="Refresh inventory">
              <RefreshCcw size={18} aria-hidden="true" />
            </button>
            <button className="ghost-button" type="button">
              <Truck size={17} aria-hidden="true" />
              Shipments
            </button>
            <button className="action-button" type="button">
              <PackagePlus size={17} aria-hidden="true" />
              Add product
            </button>
          </div>
        </header>

        <section className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Inventory and order desk</p>
            <h2>Monitor product health, order flow, and replenishment from one screen.</h2>
            <p>
              Stockroom focuses on the back office work behind commerce: inventory
              thresholds, order states, margin signals, and restock decisions.
            </p>
          </div>
          <aside className="command-stack" aria-label="Store actions">
            <button className="action-button" type="button">
              <Archive size={17} aria-hidden="true" />
              Create purchase order
            </button>
            <button className="ghost-button" type="button">
              <ShoppingBag size={17} aria-hidden="true" />
              Review orders
            </button>
            <button className="ghost-button" type="button">
              <BarChart3 size={17} aria-hidden="true" />
              Sales report
            </button>
          </aside>
        </section>

        <section className="stats-grid" aria-label="Commerce summary">
          <article className="metric">
            <span className="metric-icon">
              <Boxes size={19} aria-hidden="true" />
            </span>
            <h3>{totalStock}</h3>
            <p>Units on hand</p>
          </article>
          <article className="metric">
            <span className="metric-icon">
              <AlertTriangle size={19} aria-hidden="true" />
            </span>
            <h3>{lowStock}</h3>
            <p>Restock watch items</p>
          </article>
          <article className="metric">
            <span className="metric-icon">
              <ShoppingBag size={19} aria-hidden="true" />
            </span>
            <h3>{currency.format(orderValue)}</h3>
            <p>Open order value</p>
          </article>
          <article className="metric">
            <span className="metric-icon">
              <BarChart3 size={19} aria-hidden="true" />
            </span>
            <h3>{averageMargin}%</h3>
            <p>Average margin</p>
          </article>
        </section>

        <section className="workspace-grid">
          <div className="panel">
            <div className="panel-title">
              <div>
                <h2>Product control</h2>
                <p>Search inventory and review stock movement.</p>
              </div>
            </div>
            <div className="search-row">
              <label className="search-box">
                <Search size={17} aria-hidden="true" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products"
                />
              </label>
            </div>
            <div className="filter-row" aria-label="Product filters">
              {filters.map((item) => (
                <button
                  className={`filter-pill ${filter === item ? 'active' : ''}`}
                  key={item}
                  onClick={() => setFilter(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Reorder</th>
                    <th>Margin</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((product) => (
                    <tr key={product.sku}>
                      <td>
                        <button
                          className="row-button"
                          type="button"
                          onClick={() => setSelectedSku(product.sku)}
                        >
                          <span className="strong">{product.name}</span>
                          <br />
                          <span className="muted">{product.sku}</span>
                        </button>
                      </td>
                      <td>{product.category}</td>
                      <td>{product.stock}</td>
                      <td>{product.reorder}</td>
                      <td>{product.margin}%</td>
                      <td>
                        <span className={`status ${getStatusClass(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="panel">
            <div className="panel-title">
              <div>
                <h2>{selected.name}</h2>
                <p>{selected.sku} replenishment view</p>
              </div>
              <span className={`status ${getStatusClass(selected.status)}`}>
                {selected.status}
              </span>
            </div>
            <div className="detail-stack">
              <div className="mini-grid">
                <div className="mini-stat">
                  <p>Velocity</p>
                  <strong>{selected.velocity}%</strong>
                </div>
                <div className="mini-stat">
                  <p>Margin</p>
                  <strong>{selected.margin}%</strong>
                </div>
              </div>
              <div className="detail-row">
                <span className="muted">Stock coverage</span>
                <div className="progress" aria-label={`${selected.velocity} percent sales velocity`}>
                  <span style={{ width: `${selected.velocity}%` }} />
                </div>
              </div>
              <div className="detail-row">
                <span className="muted">Suggested action</span>
                <span className="strong">
                  {selected.stock <= selected.reorder
                    ? 'Open a supplier purchase order'
                    : 'Keep current reorder point'}
                </span>
              </div>
              <div className="detail-row">
                <span className="muted">Live orders</span>
                {orders.map((order) => (
                  <span className="split-row" key={order.id}>
                    <span>
                      <span className="strong">{order.id}</span> {order.customer}
                    </span>
                    <span className={`status ${getStatusClass(order.state)}`}>{order.state}</span>
                  </span>
                ))}
              </div>
              <div className="detail-row">
                <span className="muted">Ops checklist</span>
                <span className="split-row">
                  Supplier lead time verified
                  <CheckCircle2 size={16} aria-hidden="true" />
                </span>
                <span className="split-row">
                  Returns impact reviewed
                  <CheckCircle2 size={16} aria-hidden="true" />
                </span>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default App
