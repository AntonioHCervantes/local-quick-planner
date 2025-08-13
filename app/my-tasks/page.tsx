import dynamic from 'next/dynamic'

const TasksView = dynamic(() => import('../../components/TasksView'), { ssr: false })

export default function MyTasksPage() {
  return <TasksView />
}
