import ModalLayout from "@/components/ModalLayout";
import { Label } from "@/components/ui/label";
import { useState} from "react";
import { Button } from "@/components/ui/button";
import { UpdateVisitStatus } from "../../../wailsjs/go/backend/VisitService";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Toast } from "@/alert/toast";
interface Props {
    onClose: () => void
    id: number
    fetchData: () => void
    status: string
    code: string
}
const ChangeStatus: React.FC<Props> = ({onClose, id, fetchData, status, code}) => {
    const [selectedStatus, setSelectedStatus] = useState('');
    const handleSubmit = async () => {
        try {
            await UpdateVisitStatus(id, selectedStatus);
            Toast.fire({
                icon: 'success',
                title: 'Status berhasil diubah',
            })
            onClose();
            fetchData();
        } catch (error) {
            console.log(error);
            Toast.fire({
                icon: 'error',
                title: 'Status gagal diubah',
            })
        }
    }
    return (
        <ModalLayout open={true} onClose={onClose} title="Ubah Antrian" subtitle={'ID Pasien: ' + code} size="sm"
         footer={
                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={handleSubmit}>Ubah Status</Button>
                </div>
              }>
            <div>Status saat ini: {status}</div>
            <div>
                    <Label htmlFor="gender">Status</Label>
                    <Select onValueChange={(b) => setSelectedStatus(b)}>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {['Menunggu', 'Sedang diperiksa','Menunggu obat', 'Selesai', 'Dibatalkan'].map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                </div>
        </ModalLayout>
    );
}

export default ChangeStatus