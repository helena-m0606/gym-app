<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password123'),
            ]
        );

        // 1. FRANQUICIAS
        DB::table('franquicias')->insert([
            ['nombre' => 'FitLife', 'razon_social' => 'FitLife S.A. de C.V.', 'rfc' => 'FIT123456ABC', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'PowerGym', 'razon_social' => 'PowerGym S.A. de C.V.', 'rfc' => 'POW789012DEF', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'IronBody', 'razon_social' => 'IronBody S.A. de C.V.', 'rfc' => 'IRO345678GHI', 'created_at' => now(), 'updated_at' => now()],
        ]);
 
        // 2. ROLES
        DB::table('roles')->insert([
            ['nombre' => 'Administrador', 'descripcion' => 'Acceso total al sistema'],
            ['nombre' => 'Entrenador', 'descripcion' => 'Gestión de clases y rutinas'],
            ['nombre' => 'Recepcionista', 'descripcion' => 'Atención a miembros y registros'],
            ['nombre' => 'Gerente', 'descripcion' => 'Supervisión de sucursal'],
        ]);
 
        // 3. PERMISOS
        DB::table('permisos')->insert([
            ['nombre' => 'ver_miembros'],
            ['nombre' => 'editar_miembros'],
            ['nombre' => 'ver_clases'],
            ['nombre' => 'editar_clases'],
            ['nombre' => 'ver_pagos'],
            ['nombre' => 'editar_pagos'],
            ['nombre' => 'ver_empleados'],
            ['nombre' => 'editar_empleados'],
            ['nombre' => 'ver_reportes'],
            ['nombre' => 'gestionar_rutinas'],
        ]);
 
        // 4. ROL_PERMISO
        DB::table('rol_permiso')->insert([
            ['rol_id' => 1, 'permiso_id' => 1], ['rol_id' => 1, 'permiso_id' => 2],
            ['rol_id' => 1, 'permiso_id' => 3], ['rol_id' => 1, 'permiso_id' => 4],
            ['rol_id' => 1, 'permiso_id' => 5], ['rol_id' => 1, 'permiso_id' => 6],
            ['rol_id' => 1, 'permiso_id' => 7], ['rol_id' => 1, 'permiso_id' => 8],
            ['rol_id' => 1, 'permiso_id' => 9], ['rol_id' => 1, 'permiso_id' => 10],
            ['rol_id' => 2, 'permiso_id' => 1], ['rol_id' => 2, 'permiso_id' => 3],
            ['rol_id' => 2, 'permiso_id' => 4], ['rol_id' => 2, 'permiso_id' => 10],
            ['rol_id' => 3, 'permiso_id' => 1], ['rol_id' => 3, 'permiso_id' => 2],
            ['rol_id' => 3, 'permiso_id' => 3], ['rol_id' => 3, 'permiso_id' => 5],
            ['rol_id' => 4, 'permiso_id' => 1], ['rol_id' => 4, 'permiso_id' => 3],
            ['rol_id' => 4, 'permiso_id' => 5], ['rol_id' => 4, 'permiso_id' => 7],
            ['rol_id' => 4, 'permiso_id' => 9],
        ]);
 
        // 5. TIPOS DE MEMBRESÍA
        DB::table('tipos_membresia')->insert([
            ['nombre' => 'Mensual Básico', 'duracion_dias' => 30, 'precio' => 399.00],
            ['nombre' => 'Mensual Plus', 'duracion_dias' => 30, 'precio' => 599.00],
            ['nombre' => 'Trimestral', 'duracion_dias' => 90, 'precio' => 999.00],
            ['nombre' => 'Semestral', 'duracion_dias' => 180, 'precio' => 1799.00],
            ['nombre' => 'Anual', 'duracion_dias' => 365, 'precio' => 2999.00],
        ]);
 
        // 6. PROMOCIONES
        DB::table('promociones')->insert([
            ['nombre' => 'Año Nuevo Fitness', 'descuento_porcentaje' => 20.00, 'fecha_inicio' => '2026-01-01', 'fecha_fin' => '2026-01-31'],
            ['nombre' => 'Verano Activo', 'descuento_porcentaje' => 15.00, 'fecha_inicio' => '2026-06-01', 'fecha_fin' => '2026-08-31'],
            ['nombre' => 'Regreso a Clases', 'descuento_porcentaje' => 10.00, 'fecha_inicio' => '2026-08-01', 'fecha_fin' => '2026-08-31'],
            ['nombre' => 'Black Friday', 'descuento_porcentaje' => 30.00, 'fecha_inicio' => '2026-11-25', 'fecha_fin' => '2026-11-30'],
        ]);
 
        // 7. CATEGORÍAS DE EQUIPO
        DB::table('categorias_equipo')->insert([
            ['nombre' => 'Cardio'],
            ['nombre' => 'Fuerza'],
            ['nombre' => 'Funcional'],
            ['nombre' => 'Estiramientos'],
            ['nombre' => 'Pesas libres'],
        ]);
 
        // 8. PROVEEDORES
        DB::table('proveedores')->insert([
            ['nombre' => 'SportEquip México', 'telefono' => '3312345678', 'email' => 'ventas@sportequip.mx'],
            ['nombre' => 'GymPro Supplies', 'telefono' => '8189876543', 'email' => 'contacto@gympro.mx'],
            ['nombre' => 'FitMachines S.A.', 'telefono' => '5556781234', 'email' => 'info@fitmachines.mx'],
        ]);
 
        // 9. PRODUCTOS
        DB::table('productos')->insert([
            ['nombre' => 'Proteína Whey 1kg', 'precio' => 450.00, 'stock' => 50],
            ['nombre' => 'Barra de proteína', 'precio' => 45.00, 'stock' => 200],
            ['nombre' => 'Guantes de gym', 'precio' => 180.00, 'stock' => 30],
            ['nombre' => 'Botella de agua 1L', 'precio' => 120.00, 'stock' => 80],
            ['nombre' => 'Camiseta deportiva', 'precio' => 250.00, 'stock' => 40],
            ['nombre' => 'Shorts deportivo', 'precio' => 220.00, 'stock' => 35],
            ['nombre' => 'Creatina 500g', 'precio' => 380.00, 'stock' => 25],
            ['nombre' => 'Rodillera deportiva', 'precio' => 150.00, 'stock' => 20],
        ]);
 
        // 10. EJERCICIOS
        DB::table('ejercicios')->insert([
            ['nombre' => 'Press de banca', 'descripcion' => 'Ejercicio de empuje para pecho con barra'],
            ['nombre' => 'Sentadilla', 'descripcion' => 'Ejercicio compuesto para tren inferior'],
            ['nombre' => 'Peso muerto', 'descripcion' => 'Ejercicio de tirón para espalda baja y piernas'],
            ['nombre' => 'Dominadas', 'descripcion' => 'Ejercicio de tirón para espalda y bíceps'],
            ['nombre' => 'Press militar', 'descripcion' => 'Ejercicio de empuje para hombros'],
            ['nombre' => 'Curl de bíceps', 'descripcion' => 'Ejercicio de aislamiento para bíceps'],
            ['nombre' => 'Extensión de tríceps', 'descripcion' => 'Ejercicio de aislamiento para tríceps'],
            ['nombre' => 'Plancha', 'descripcion' => 'Ejercicio de core isométrico'],
            ['nombre' => 'Zancadas', 'descripcion' => 'Ejercicio unilateral para piernas'],
            ['nombre' => 'Remo con barra', 'descripcion' => 'Ejercicio de tirón para espalda media'],
        ]);
 
        // 11. SUCURSALES
        DB::table('sucursales')->insert([
            ['franquicia_id' => 1, 'nombre' => 'FitLife Zapopan', 'direccion' => 'Av. Patria 1234', 'ciudad' => 'Zapopan', 'telefono' => '3312341234', 'activa' => true, 'created_at' => now(), 'updated_at' => now()],
            ['franquicia_id' => 1, 'nombre' => 'FitLife Providencia', 'direccion' => 'Av. Providencia 567', 'ciudad' => 'Guadalajara', 'telefono' => '3398765432', 'activa' => true, 'created_at' => now(), 'updated_at' => now()],
            ['franquicia_id' => 2, 'nombre' => 'PowerGym San Pedro', 'direccion' => 'Av. Garza García 890', 'ciudad' => 'San Pedro', 'telefono' => '8181234567', 'activa' => true, 'created_at' => now(), 'updated_at' => now()],
            ['franquicia_id' => 3, 'nombre' => 'IronBody Polanco', 'direccion' => 'Av. Presidente Masaryk 321', 'ciudad' => 'Ciudad de México', 'telefono' => '5551234567', 'activa' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
 
        // 12. HORARIOS DE SUCURSAL
        DB::table('horarios_sucursal')->insert([
            ['sucursal_id' => 1, 'dia_semana' => 'Lunes', 'hora_apertura' => '06:00', 'hora_cierre' => '22:00'],
            ['sucursal_id' => 1, 'dia_semana' => 'Martes', 'hora_apertura' => '06:00', 'hora_cierre' => '22:00'],
            ['sucursal_id' => 1, 'dia_semana' => 'Miércoles', 'hora_apertura' => '06:00', 'hora_cierre' => '22:00'],
            ['sucursal_id' => 1, 'dia_semana' => 'Jueves', 'hora_apertura' => '06:00', 'hora_cierre' => '22:00'],
            ['sucursal_id' => 1, 'dia_semana' => 'Viernes', 'hora_apertura' => '06:00', 'hora_cierre' => '21:00'],
            ['sucursal_id' => 1, 'dia_semana' => 'Sábado', 'hora_apertura' => '07:00', 'hora_cierre' => '20:00'],
            ['sucursal_id' => 1, 'dia_semana' => 'Domingo', 'hora_apertura' => '08:00', 'hora_cierre' => '14:00'],
            ['sucursal_id' => 2, 'dia_semana' => 'Lunes', 'hora_apertura' => '06:00', 'hora_cierre' => '22:00'],
            ['sucursal_id' => 2, 'dia_semana' => 'Martes', 'hora_apertura' => '06:00', 'hora_cierre' => '22:00'],
            ['sucursal_id' => 2, 'dia_semana' => 'Sábado', 'hora_apertura' => '07:00', 'hora_cierre' => '20:00'],
        ]);
 
        // 13. EMPLEADOS
        DB::table('empleados')->insert([
            ['sucursal_id' => 1, 'nombre' => 'Carlos Mendoza', 'email' => 'carlos.mendoza@fitlife.mx', 'telefono' => '3311111111', 'salario' => 12000.00, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['sucursal_id' => 1, 'nombre' => 'Ana Torres', 'email' => 'ana.torres@fitlife.mx', 'telefono' => '3322222222', 'salario' => 10000.00, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['sucursal_id' => 1, 'nombre' => 'Luis Ramírez', 'email' => 'luis.ramirez@fitlife.mx', 'telefono' => '3333333333', 'salario' => 9500.00, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['sucursal_id' => 2, 'nombre' => 'María González', 'email' => 'maria.gonzalez@fitlife.mx', 'telefono' => '3344444444', 'salario' => 11000.00, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['sucursal_id' => 2, 'nombre' => 'Roberto Jiménez', 'email' => 'roberto.jimenez@fitlife.mx', 'telefono' => '3355555555', 'salario' => 9800.00, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['sucursal_id' => 3, 'nombre' => 'Sofía Herrera', 'email' => 'sofia.herrera@powergym.mx', 'telefono' => '8186666666', 'salario' => 10500.00, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
 
        // 14. EMPLEADO_ROL
        DB::table('empleado_rol')->insert([
            ['empleado_id' => 1, 'rol_id' => 1],
            ['empleado_id' => 2, 'rol_id' => 2],
            ['empleado_id' => 3, 'rol_id' => 3],
            ['empleado_id' => 4, 'rol_id' => 2],
            ['empleado_id' => 5, 'rol_id' => 3],
            ['empleado_id' => 6, 'rol_id' => 4],
        ]);
 
        // 15. ASISTENCIAS DE EMPLEADOS
        DB::table('asistencias_empleado')->insert([
            ['empleado_id' => 1, 'fecha' => '2026-04-01', 'hora_entrada' => '08:00', 'hora_salida' => '17:00'],
            ['empleado_id' => 1, 'fecha' => '2026-04-02', 'hora_entrada' => '08:05', 'hora_salida' => '17:10'],
            ['empleado_id' => 2, 'fecha' => '2026-04-01', 'hora_entrada' => '09:00', 'hora_salida' => '18:00'],
            ['empleado_id' => 2, 'fecha' => '2026-04-02', 'hora_entrada' => '09:00', 'hora_salida' => '18:00'],
            ['empleado_id' => 3, 'fecha' => '2026-04-01', 'hora_entrada' => '07:55', 'hora_salida' => '16:55'],
            ['empleado_id' => 3, 'fecha' => '2026-04-02', 'hora_entrada' => '08:00', 'hora_salida' => '17:00'],
        ]);
 
        // 16. EQUIPOS
        DB::table('equipos')->insert([
            ['sucursal_id' => 1, 'categoria_id' => 1, 'nombre' => 'Caminadora NordicTrack', 'estado' => 'activo'],
            ['sucursal_id' => 1, 'categoria_id' => 1, 'nombre' => 'Bicicleta Estática Schwinn', 'estado' => 'activo'],
            ['sucursal_id' => 1, 'categoria_id' => 2, 'nombre' => 'Máquina de pecho Technogym', 'estado' => 'activo'],
            ['sucursal_id' => 1, 'categoria_id' => 2, 'nombre' => 'Rack de sentadillas', 'estado' => 'activo'],
            ['sucursal_id' => 1, 'categoria_id' => 5, 'nombre' => 'Mancuernas 5-50kg', 'estado' => 'activo'],
            ['sucursal_id' => 2, 'categoria_id' => 1, 'nombre' => 'Elíptica Life Fitness', 'estado' => 'activo'],
            ['sucursal_id' => 2, 'categoria_id' => 3, 'nombre' => 'TRX Suspension Kit', 'estado' => 'activo'],
            ['sucursal_id' => 2, 'categoria_id' => 4, 'nombre' => 'Colchonetas de yoga', 'estado' => 'activo'],
            ['sucursal_id' => 3, 'categoria_id' => 1, 'nombre' => 'Caminadora Precor', 'estado' => 'mantenimiento'],
            ['sucursal_id' => 3, 'categoria_id' => 2, 'nombre' => 'Prensa de pierna', 'estado' => 'activo'],
        ]);
 
        // 17. MANTENIMIENTOS
        DB::table('mantenimientos')->insert([
            ['equipo_id' => 1, 'fecha' => '2026-03-15', 'descripcion' => 'Lubricación de banda y revisión eléctrica', 'costo' => 500.00],
            ['equipo_id' => 3, 'fecha' => '2026-03-20', 'descripcion' => 'Ajuste de cables y poleas', 'costo' => 350.00],
            ['equipo_id' => 9, 'fecha' => '2026-04-01', 'descripcion' => 'Reparación de motor', 'costo' => 1800.00],
            ['equipo_id' => 2, 'fecha' => '2026-02-10', 'descripcion' => 'Cambio de pedales y ajuste de resistencia', 'costo' => 400.00],
        ]);
 
        // 18. COMPRAS
        DB::table('compras')->insert([
            ['proveedor_id' => 1, 'fecha' => '2026-01-15', 'total' => 45000.00],
            ['proveedor_id' => 2, 'fecha' => '2026-02-10', 'total' => 12000.00],
            ['proveedor_id' => 3, 'fecha' => '2026-03-05', 'total' => 28000.00],
        ]);
 
        // 19. DETALLE_COMPRA
        DB::table('detalle_compra')->insert([
            ['compra_id' => 1, 'equipo_id' => 1, 'cantidad' => 2, 'precio_unitario' => 15000.00],
            ['compra_id' => 1, 'equipo_id' => 2, 'cantidad' => 3, 'precio_unitario' => 5000.00],
            ['compra_id' => 2, 'equipo_id' => 7, 'cantidad' => 5, 'precio_unitario' => 2400.00],
            ['compra_id' => 3, 'equipo_id' => 3, 'cantidad' => 1, 'precio_unitario' => 28000.00],
        ]);
 
        // 20. MIEMBROS
        DB::table('miembros')->insert([
            ['sucursal_id' => 1, 'nombre' => 'Pedro Sánchez', 'email' => 'pedro.sanchez@gmail.com', 'telefono' => '3360001111', 'fecha_nacimiento' => '1990-05-15', 'genero' => 'masculino', 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['sucursal_id' => 1, 'nombre' => 'Laura Vega', 'email' => 'laura.vega@gmail.com', 'telefono' => '3360002222', 'fecha_nacimiento' => '1995-08-22', 'genero' => 'femenino', 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['sucursal_id' => 1, 'nombre' => 'Miguel Ángel Ruiz', 'email' => 'miguel.ruiz@gmail.com', 'telefono' => '3360003333', 'fecha_nacimiento' => '1988-11-30', 'genero' => 'masculino', 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['sucursal_id' => 1, 'nombre' => 'Diana López', 'email' => 'diana.lopez@gmail.com', 'telefono' => '3360004444', 'fecha_nacimiento' => '1993-03-10', 'genero' => 'femenino', 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['sucursal_id' => 2, 'nombre' => 'Fernando Castro', 'email' => 'fernando.castro@gmail.com', 'telefono' => '3360005555', 'fecha_nacimiento' => '1985-07-18', 'genero' => 'masculino', 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['sucursal_id' => 2, 'nombre' => 'Valeria Moreno', 'email' => 'valeria.moreno@gmail.com', 'telefono' => '3360006666', 'fecha_nacimiento' => '1997-01-25', 'genero' => 'femenino', 'estado' => false, 'created_at' => now(), 'updated_at' => now()],
            ['sucursal_id' => 3, 'nombre' => 'Alejandro Reyes', 'email' => 'alejandro.reyes@gmail.com', 'telefono' => '8180007777', 'fecha_nacimiento' => '1991-09-05', 'genero' => 'masculino', 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['sucursal_id' => 3, 'nombre' => 'Gabriela Flores', 'email' => 'gabriela.flores@gmail.com', 'telefono' => '8180008888', 'fecha_nacimiento' => '1994-12-14', 'genero' => 'femenino', 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
 
        // 21. CONTACTO DE EMERGENCIA
        DB::table('contacto_emergencia')->insert([
            ['miembro_id' => 1, 'nombre' => 'Rosa Sánchez', 'telefono' => '3361111111', 'relacion' => 'Madre'],
            ['miembro_id' => 2, 'nombre' => 'Héctor Vega', 'telefono' => '3362222222', 'relacion' => 'Padre'],
            ['miembro_id' => 3, 'nombre' => 'Claudia Ruiz', 'telefono' => '3363333333', 'relacion' => 'Esposa'],
            ['miembro_id' => 4, 'nombre' => 'Jorge López', 'telefono' => '3364444444', 'relacion' => 'Hermano'],
            ['miembro_id' => 5, 'nombre' => 'Patricia Castro', 'telefono' => '3365555555', 'relacion' => 'Madre'],
            ['miembro_id' => 7, 'nombre' => 'Ernesto Reyes', 'telefono' => '8186666666', 'relacion' => 'Padre'],
            ['miembro_id' => 8, 'nombre' => 'Carmen Flores', 'telefono' => '8187777777', 'relacion' => 'Madre'],
        ]);
 
        // 22. MEMBRESÍAS
        DB::table('membresias')->insert([
            ['miembro_id' => 1, 'tipo_membresia_id' => 2, 'fecha_inicio' => '2026-03-01', 'fecha_fin' => '2026-03-31', 'activa' => true],
            ['miembro_id' => 2, 'tipo_membresia_id' => 1, 'fecha_inicio' => '2026-03-15', 'fecha_fin' => '2026-04-14', 'activa' => true],
            ['miembro_id' => 3, 'tipo_membresia_id' => 3, 'fecha_inicio' => '2026-02-01', 'fecha_fin' => '2026-04-30', 'activa' => true],
            ['miembro_id' => 4, 'tipo_membresia_id' => 5, 'fecha_inicio' => '2026-01-01', 'fecha_fin' => '2026-12-31', 'activa' => true],
            ['miembro_id' => 5, 'tipo_membresia_id' => 2, 'fecha_inicio' => '2026-03-10', 'fecha_fin' => '2026-04-09', 'activa' => true],
            ['miembro_id' => 6, 'tipo_membresia_id' => 1, 'fecha_inicio' => '2026-02-01', 'fecha_fin' => '2026-03-02', 'activa' => false],
            ['miembro_id' => 7, 'tipo_membresia_id' => 4, 'fecha_inicio' => '2026-01-15', 'fecha_fin' => '2026-07-14', 'activa' => true],
            ['miembro_id' => 8, 'tipo_membresia_id' => 2, 'fecha_inicio' => '2026-03-20', 'fecha_fin' => '2026-04-19', 'activa' => true],
        ]);
 
        // 23. MEMBRESÍA_PROMOCION
        DB::table('membresia_promocion')->insert([
            ['membresia_id' => 1, 'promocion_id' => 1],
            ['membresia_id' => 3, 'promocion_id' => 1],
            ['membresia_id' => 7, 'promocion_id' => 2],
        ]);
 
        // 24. PAGOS
        DB::table('pagos')->insert([
            ['membresia_id' => 1, 'monto' => 479.00, 'fecha_pago' => '2026-03-01', 'metodo_pago' => 'tarjeta', 'estado' => 'pagado'],
            ['membresia_id' => 2, 'monto' => 399.00, 'fecha_pago' => '2026-03-15', 'metodo_pago' => 'efectivo', 'estado' => 'pagado'],
            ['membresia_id' => 3, 'monto' => 849.00, 'fecha_pago' => '2026-02-01', 'metodo_pago' => 'transferencia', 'estado' => 'pagado'],
            ['membresia_id' => 4, 'monto' => 2999.00, 'fecha_pago' => '2026-01-01', 'metodo_pago' => 'tarjeta', 'estado' => 'pagado'],
            ['membresia_id' => 5, 'monto' => 599.00, 'fecha_pago' => '2026-03-10', 'metodo_pago' => 'efectivo', 'estado' => 'pagado'],
            ['membresia_id' => 6, 'monto' => 399.00, 'fecha_pago' => '2026-02-01', 'metodo_pago' => 'efectivo', 'estado' => 'pagado'],
            ['membresia_id' => 7, 'monto' => 1529.00, 'fecha_pago' => '2026-01-15', 'metodo_pago' => 'tarjeta', 'estado' => 'pagado'],
            ['membresia_id' => 8, 'monto' => 599.00, 'fecha_pago' => '2026-03-20', 'metodo_pago' => 'transferencia', 'estado' => 'pagado'],
        ]);
 
        // 25. FACTURAS
        DB::table('facturas')->insert([
            ['pago_id' => 1, 'fecha' => '2026-03-01', 'total' => 479.00],
            ['pago_id' => 2, 'fecha' => '2026-03-15', 'total' => 399.00],
            ['pago_id' => 3, 'fecha' => '2026-02-01', 'total' => 849.00],
            ['pago_id' => 4, 'fecha' => '2026-01-01', 'total' => 2999.00],
            ['pago_id' => 5, 'fecha' => '2026-03-10', 'total' => 599.00],
            ['pago_id' => 7, 'fecha' => '2026-01-15', 'total' => 1529.00],
            ['pago_id' => 8, 'fecha' => '2026-03-20', 'total' => 599.00],
        ]);
 
        // 26. CLASES
        DB::table('clases')->insert([
            ['entrenador_id' => 2, 'sucursal_id' => 1, 'nombre' => 'Yoga Matutino', 'capacidad' => 15, 'fecha' => '2026-04-09 07:00:00'],
            ['entrenador_id' => 2, 'sucursal_id' => 1, 'nombre' => 'Spinning Intenso', 'capacidad' => 20, 'fecha' => '2026-04-09 09:00:00'],
            ['entrenador_id' => 4, 'sucursal_id' => 2, 'nombre' => 'CrossFit Básico', 'capacidad' => 12, 'fecha' => '2026-04-09 08:00:00'],
            ['entrenador_id' => 4, 'sucursal_id' => 2, 'nombre' => 'Pilates', 'capacidad' => 10, 'fecha' => '2026-04-10 10:00:00'],
            ['entrenador_id' => 2, 'sucursal_id' => 1, 'nombre' => 'Zumba', 'capacidad' => 25, 'fecha' => '2026-04-10 18:00:00'],
        ]);
 
        // 27. RESERVAS DE CLASE
        DB::table('reservas_clase')->insert([
            ['clase_id' => 1, 'miembro_id' => 1, 'estado' => 'confirmada'],
            ['clase_id' => 1, 'miembro_id' => 2, 'estado' => 'confirmada'],
            ['clase_id' => 2, 'miembro_id' => 3, 'estado' => 'confirmada'],
            ['clase_id' => 2, 'miembro_id' => 1, 'estado' => 'cancelada'],
            ['clase_id' => 3, 'miembro_id' => 5, 'estado' => 'confirmada'],
            ['clase_id' => 4, 'miembro_id' => 5, 'estado' => 'confirmada'],
            ['clase_id' => 5, 'miembro_id' => 2, 'estado' => 'confirmada'],
            ['clase_id' => 5, 'miembro_id' => 4, 'estado' => 'confirmada'],
        ]);
 
        // 28. CHECKINS
        DB::table('checkins')->insert([
            ['miembro_id' => 1, 'fecha' => '2026-04-01 08:30:00'],
            ['miembro_id' => 1, 'fecha' => '2026-04-02 09:00:00'],
            ['miembro_id' => 2, 'fecha' => '2026-04-01 10:00:00'],
            ['miembro_id' => 3, 'fecha' => '2026-04-01 07:45:00'],
            ['miembro_id' => 3, 'fecha' => '2026-04-03 08:00:00'],
            ['miembro_id' => 4, 'fecha' => '2026-04-02 18:00:00'],
            ['miembro_id' => 5, 'fecha' => '2026-04-01 07:00:00'],
            ['miembro_id' => 7, 'fecha' => '2026-04-02 06:30:00'],
        ]);

        // 29. EVALUACIONES FÍSICAS
        DB::table('evaluaciones_fisicas')->insert([
            ['miembro_id' => 1, 'fecha' => '2026-03-01', 'resultados' => '{"imc": 24.5, "grasa": "18%"}', 'observaciones' => 'Buen estado general, mejorar resistencia'],
            ['miembro_id' => 2, 'fecha' => '2026-03-15', 'resultados' => '{"imc": 22.1, "grasa": "22%"}', 'observaciones' => 'Excelente estado físico'],
            ['miembro_id' => 3, 'fecha' => '2026-02-01', 'resultados' => '{"imc": 26.3, "grasa": "21%"}', 'observaciones' => 'Reducir porcentaje de grasa'],
            ['miembro_id' => 5, 'fecha' => '2026-03-10', 'resultados' => '{"imc": 23.8, "grasa": "16%"}', 'observaciones' => 'Muy buena condición física'],
            ['miembro_id' => 7, 'fecha' => '2026-01-15', 'resultados' => '{"imc": 25.0, "grasa": "19%"}', 'observaciones' => 'Incrementar masa muscular'],
        ]);
 
        // 30. RUTINAS
        DB::table('rutinas')->insert([
            ['miembro_id' => 1, 'entrenador_id' => 2, 'nombre' => 'Rutina Pérdida de Peso', 'fecha_inicio' => '2026-03-01'],
            ['miembro_id' => 2, 'entrenador_id' => 2, 'nombre' => 'Rutina Tonificación', 'fecha_inicio' => '2026-03-15'],
            ['miembro_id' => 3, 'entrenador_id' => 4, 'nombre' => 'Rutina Fuerza Básica', 'fecha_inicio' => '2026-02-01'],
            ['miembro_id' => 5, 'entrenador_id' => 4, 'nombre' => 'Rutina Hipertrofia', 'fecha_inicio' => '2026-03-10'],
            ['miembro_id' => 7, 'entrenador_id' => 2, 'nombre' => 'Rutina Funcional', 'fecha_inicio' => '2026-01-15'],
        ]);
 
        // 31. RUTINA_EJERCICIO
        DB::table('rutina_ejercicio')->insert([
            ['rutina_id' => 1, 'ejercicio_id' => 2, 'series' => 3, 'repeticiones' => 15, 'descanso_segundos' => 60],
            ['rutina_id' => 1, 'ejercicio_id' => 9, 'series' => 3, 'repeticiones' => 12, 'descanso_segundos' => 60],
            ['rutina_id' => 1, 'ejercicio_id' => 8, 'series' => 3, 'repeticiones' => 30, 'descanso_segundos' => 45],
            ['rutina_id' => 2, 'ejercicio_id' => 6, 'series' => 4, 'repeticiones' => 12, 'descanso_segundos' => 60],
            ['rutina_id' => 2, 'ejercicio_id' => 7, 'series' => 4, 'repeticiones' => 12, 'descanso_segundos' => 60],
            ['rutina_id' => 2, 'ejercicio_id' => 8, 'series' => 3, 'repeticiones' => 45, 'descanso_segundos' => 30],
            ['rutina_id' => 3, 'ejercicio_id' => 1, 'series' => 4, 'repeticiones' => 8, 'descanso_segundos' => 90],
            ['rutina_id' => 3, 'ejercicio_id' => 2, 'series' => 4, 'repeticiones' => 8, 'descanso_segundos' => 90],
            ['rutina_id' => 3, 'ejercicio_id' => 3, 'series' => 3, 'repeticiones' => 6, 'descanso_segundos' => 120],
            ['rutina_id' => 4, 'ejercicio_id' => 1, 'series' => 4, 'repeticiones' => 10, 'descanso_segundos' => 90],
            ['rutina_id' => 4, 'ejercicio_id' => 2, 'series' => 4, 'repeticiones' => 10, 'descanso_segundos' => 90],
            ['rutina_id' => 4, 'ejercicio_id' => 4, 'series' => 3, 'repeticiones' => 8, 'descanso_segundos' => 90],
            ['rutina_id' => 5, 'ejercicio_id' => 8, 'series' => 3, 'repeticiones' => 60, 'descanso_segundos' => 30],
            ['rutina_id' => 5, 'ejercicio_id' => 9, 'series' => 3, 'repeticiones' => 10, 'descanso_segundos' => 60],
            ['rutina_id' => 5, 'ejercicio_id' => 5, 'series' => 3, 'repeticiones' => 10, 'descanso_segundos' => 90],
        ]);
 
        // 32. PROGRESO DE MIEMBRO
        DB::table('progreso_miembro')->insert([
            ['miembro_id' => 1, 'fecha' => '2026-03-01', 'metricas' => '{"peso": 85, "grasa": 20, "musculo": 38}'],
            ['miembro_id' => 1, 'fecha' => '2026-04-01', 'metricas' => '{"peso": 83, "grasa": 18, "musculo": 39}'],
            ['miembro_id' => 2, 'fecha' => '2026-03-15', 'metricas' => '{"peso": 62, "grasa": 23, "musculo": 32}'],
            ['miembro_id' => 3, 'fecha' => '2026-02-01', 'metricas' => '{"peso": 90, "grasa": 23, "musculo": 40}'],
            ['miembro_id' => 3, 'fecha' => '2026-04-01', 'metricas' => '{"peso": 88, "grasa": 21, "musculo": 41}'],
            ['miembro_id' => 5, 'fecha' => '2026-03-10', 'metricas' => '{"peso": 78, "grasa": 17, "musculo": 42}'],
        ]);
 
        // 33. NOTIFICACIONES
        DB::table('notificaciones')->insert([
            ['miembro_id' => 1, 'mensaje' => 'Tu membresía vence en 5 días. ¡Renueva ahora!', 'fecha' => '2026-03-26', 'leida' => false],
            ['miembro_id' => 2, 'mensaje' => 'Tienes una clase de Yoga mañana a las 7:00 AM', 'fecha' => '2026-04-08', 'leida' => false],
            ['miembro_id' => 3, 'mensaje' => 'Tu entrenador ha actualizado tu rutina', 'fecha' => '2026-04-01', 'leida' => true],
            ['miembro_id' => 6, 'mensaje' => 'Tu membresía ha vencido. ¡Vuelve pronto!', 'fecha' => '2026-03-03', 'leida' => false],
            ['miembro_id' => 5, 'mensaje' => 'Nueva clase de CrossFit disponible', 'fecha' => '2026-04-07', 'leida' => true],
        ]);
 
        // 34. VENTAS DE PRODUCTOS
        DB::table('ventas_productos')->insert([
            ['miembro_id' => 1, 'producto_id' => 1, 'cantidad' => 1, 'total' => 450.00],
            ['miembro_id' => 2, 'producto_id' => 2, 'cantidad' => 3, 'total' => 135.00],
            ['miembro_id' => 3, 'producto_id' => 3, 'cantidad' => 1, 'total' => 180.00],
            ['miembro_id' => 5, 'producto_id' => 1, 'cantidad' => 2, 'total' => 900.00],
            ['miembro_id' => 7, 'producto_id' => 7, 'cantidad' => 1, 'total' => 380.00],
            ['miembro_id' => 4, 'producto_id' => 4, 'cantidad' => 2, 'total' => 240.00],
        ]);

    }
}
