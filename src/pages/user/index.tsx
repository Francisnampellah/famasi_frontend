import { useState } from 'react';
import { User } from '../../types/user';
import { UserTable } from './components/UserTable';
import { CreateUserDialog } from './components/CreateUserDialog';
import { EditUserDialog } from './components/EditUserDialog';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/header';
import { useUsers } from './hooks/useUser';
import { CreateUserDto, UpdateUserDto } from '../../types/user';

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { 
    users, 
    isLoading, 
    isDeleting, 
    createUser, 
    updateUser, 
    deleteUser 
  } = useUsers();

  const handleDelete = async (id: number) => {
    await deleteUser(id);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateUser = async (userData: CreateUserDto) => {
    await createUser(userData);
  };

  const handleUpdateUser = async (params: { id: number; userData: UpdateUserDto }) => {
    await updateUser(params);
  };

  return (
    <DashboardLayout>
      <Header Title='User Management' date={date} setDate={setDate}/>
      <div className="container mx-auto ">
        <UserTable
          users={users}
          isLoading={isLoading}
          onDelete={handleDelete}
          onEdit={handleEdit}
          isDeleting={isDeleting}
          handleAddUser={handleCreate}
        />

        <CreateUserDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateUser={handleCreateUser}
        />

        {selectedUser && (
          <EditUserDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            user={selectedUser}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </div>
    </DashboardLayout>
  );
} 