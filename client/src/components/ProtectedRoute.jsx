import { Navigate, useParams } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token')
    const { cityId } = useParams()

    if (!token) {
        return <Navigate to={`/city/${cityId}/auth`} replace />
    }

    return children
}
