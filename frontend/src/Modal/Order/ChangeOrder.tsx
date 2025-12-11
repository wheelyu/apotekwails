import ModalLayout from "@/components/ModalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UpdateQueueNumber } from "../../../wailsjs/go/backend/VisitService";
import { Toast } from "@/alert/toast";
interface Props {
    onClose: () => void
    id: number
    fetchData: () => void
    code: string
    queueNumber: number
}
const ChangeOrder: React.FC<Props> = ({onClose, id, fetchData, code, queueNumber}) => {
    const [newQueueNumber, setNewQueueNumber] = useState(0);

    const handleSubmit = async () => {
        try {
            await UpdateQueueNumber(id, newQueueNumber);
            Toast.fire({
                icon: 'success',
                title: 'Nomor antrian berhasil diubah',
            })
            onClose();
            fetchData();
        } catch (error) {
            console.log(error);
            Toast.fire({
                icon: 'error',
                title: 'Nomor antrian gagal diubah',
            })
        }
    }
    return (
        <ModalLayout open={true} onClose={onClose} title="Ubah Antrian" subtitle={'ID Pasien: ' + code} size="sm"
         footer={
                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={handleSubmit}>Ubah Antrian</Button>
                </div>
              }>
            <div>Nomor antrian saat ini: {queueNumber}</div>
            <div>
                <Label htmlFor="nik">Masukkan Nomor Antrian Baru</Label>
                <Input id="nik" name="nik" value={newQueueNumber } onChange={(e) => setNewQueueNumber(parseInt(e.target.value))} placeholder="Masukkan Nomor Antrian" required />
            </div>
        </ModalLayout>
    );
}

export default ChangeOrder