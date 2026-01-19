import CreateAdminForm from '@/Components/CreateAdminForm';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function CreateAdminPage() {
    await connectDB();
    const admins = await User.find({ role: "admin" });
    if (!admins || admins.length === 0) {
        return <p className='font-semibold text-lg'>No admin found</p>
    }

    console.log("Admins:", admins.map(a => a.email));

return(
    <>
    <select name="admins" id="">
        {admins.map(a => <option value={a.email}>{a.email}</option>)}
    </select>
    <CreateAdminForm/>
    </>
)
}
