import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  ingredients: string;
  in_stock: boolean;
  category_id: number;
  category_name: string;
  image_url: string;
}

interface Category {
  id: number;
  name: string;
}

const MenuItemList: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    ingredients: '',
    in_stock: true,
    category_id: '',
    image: null as File | null,
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/menu-items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpen = (item?: MenuItem) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        name: item.name,
        price: item.price.toString(),
        ingredients: item.ingredients || '',
        in_stock: item.in_stock,
        category_id: item.category_id.toString(),
        image: null,
      });
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        price: '',
        ingredients: '',
        in_stock: true,
        category_id: '',
        image: null,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Convertir los valores a string antes de añadirlos al FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        if (typeof value === 'boolean') {
          formDataToSend.append(key, value.toString());
        } else {
          formDataToSend.append(key, value as string | Blob);
        }
      }
    });

    try {
      if (selectedItem) {
        await axios.put(`http://localhost:3000/api/menu-items/${selectedItem.id}`, formDataToSend);
      } else {
        await axios.post('http://localhost:3000/api/menu-items', formDataToSend);
      }
      fetchItems();
      handleClose();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este item?')) {
      try {
        await axios.delete(`http://localhost:3000/api/menu-items/${id}`);
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ marginBottom: 20 }}>
        Añadir Nuevo Item
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>En Stock</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}€</TableCell>
                <TableCell>{item.category_name}</TableCell>
                <TableCell>{item.in_stock ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedItem ? 'Editar Item' : 'Nuevo Item'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Precio"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Ingredientes"
              fullWidth
              multiline
              rows={4}
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                />
              }
              label="En Stock"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default MenuItemList; 