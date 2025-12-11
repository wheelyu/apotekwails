interface Props {
    onClose: () => void
    fetchData: () => void
    openQueue: (id: number, code: string, name: string) => void
    id: string
}

export default Props