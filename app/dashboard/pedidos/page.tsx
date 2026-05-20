import { getOrders } from '@/lib/orders'
import PedidosClient from './PedidosClient'

export default async function PedidosPage() {
  const orders = await getOrders()
  return <PedidosClient initialOrders={orders} />
}
