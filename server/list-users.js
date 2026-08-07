import dotenv from 'dotenv';
import supabase from './config/db.js';

dotenv.config();

const listUsers = async () => {
  console.log('Fetching all registered accounts from Supabase...');
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, role, employee_id, employees(name, email, phone)')
      .order('role');

    if (error) throw error;

    console.log('\n--- REGISTERED ACCOUNTS LIST ---');
    if (!users || users.length === 0) {
      console.log('No accounts found in the database.');
    } else {
      users.forEach((u, i) => {
        console.log(`\nAccount #${i + 1}:`);
        console.log(`- Username/Email: ${u.username}`);
        console.log(`- Role: ${u.role}`);
        if (u.employees) {
          console.log(`- Host Profile Name: ${u.employees.name}`);
          console.log(`- Host Profile Email: ${u.employees.email}`);
          console.log(`- Host Profile Phone: ${u.employees.phone}`);
        } else {
          console.log('- Host Profile: None linked');
        }
      });
    }
    console.log('--------------------------------\n');
    process.exit(0);
  } catch (error) {
    console.error('Error fetching accounts:', error.message);
    process.exit(1);
  }
};

listUsers();
