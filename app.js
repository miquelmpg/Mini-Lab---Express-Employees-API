import express from 'express';
import employees from './data.json' with { type: 'json' };

const employeeList = [];

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello World'});
});

app.get('/api/employees', (req, res) => {
    res.json(employees);
});

app.get('/api/employees', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 2;
    const pageStart = pageSize * (page - 1);
    const pageEnd = pageStart + pageSize;
    const filteredByPage = employees.slice(pageStart, pageEnd);
    res.json(filteredByPage);
});

app.get('/api/employees/oldest', (req, res) => {
    const ages = employees.map(({ age }) => age);
    const maxAge = Math.max(...ages);
    const employeeMaxAge = employees.find((employee) => employee.age === maxAge);
    res.json(employeeMaxAge);
});


app.get('/api/employees', (req, res) => {
    const employeesFiltered = req.query.user === 'true' ? employees.filter((employee) => employee.privileges === 'user') : employees.filter((employee) => employee.privileges === 'admin');
    res.json(employeesFiltered);
});

app.get('/api/employees', (req, res) => {
    const filteredEmployeesByBadges = employees.filter(({ badges }) => badges.includes(req.query.badges))
    res.json(filteredEmployeesByBadges);
});

app.get('/api/employees/:name', (req, res) => {
    const nameEmployee = req.params.name;
    const employeeFilteredByName = employees.find(({ name }) => name === nameEmployee);
    if (!employeeFilteredByName) res.status(404).json({code: "not_found"});
    res.json(employeeFilteredByName);
});

app.post('/api/employees', (req, res) => {
    const employee = req.body;
    if (!employee) res.status(404).json({code: "not_found"});
    employeeList.push(employee);
    res.json({'mewEmployee': employee})
});

app.listen(3000, () => {
    console.log('Ready on http://localhost:3000');
});