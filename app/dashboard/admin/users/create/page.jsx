import CreateAdminForm from '@/Components/CreateAdminForm';
import connectDB from '@/lib/mongodb';
import User from '@/models/User'; // Adjust path based on your project structure

export default async function CreateAdminPage() {
    await connectDB();

    // Fetch all users with role 'admin' from database
    const adminUsers = await User.find({ role: 'admin' })
        .select('_id fullName email adminType permissions phone')
        .lean()
        .sort({ createdAt: -1 });

    // Convert MongoDB ObjectIds to strings for client component
    const adminsData = adminUsers.map(admin => ({
        ...admin,
        _id: admin._id.toString(),
    }));

    return (
        <>
            <CreateAdminForm adminsData={adminsData} />
        </>
    );
}