
-- public.categorias_equipo definition

-- Drop table

-- DROP TABLE public.categorias_equipo;

CREATE TABLE public.categorias_equipo (
	id bigserial PRIMARY KEY,
	nombre varchar(50) NOT NULL,
	CONSTRAINT categorias_equipo_pkey PRIMARY KEY (id)
);


-- public.ejercicios definition

-- Drop table

-- DROP TABLE public.ejercicios;

CREATE TABLE public.ejercicios (
	id bigserial PRIMARY KEY,
	nombre varchar(50) NOT NULL,
	descripcion text NULL,
	CONSTRAINT ejercicios_pkey PRIMARY KEY (id)
);


-- public.franquicias definition

-- Drop table

-- DROP TABLE public.franquicias;

CREATE TABLE public.franquicias (
	id bigserial PRIMARY KEY,
	nombre varchar(50) NOT NULL,
	razon_social varchar(50) NOT NULL,
	rfc varchar(12) NOT NULL UNIQUE,
	created_at timestamp(0) NOT NULL DEFAULT,
	updated_at timestamp(0) NOT NULL DEFAULT,
	CONSTRAINT franquicias_pkey PRIMARY KEY (id),
	CONSTRAINT franquicias_rfc_unique UNIQUE (rfc)
);


-- public.permisos definition

-- Drop table

-- DROP TABLE public.permisos;

CREATE TABLE public.permisos (
	id bigserial PRIMARY KEY,
	nombre varchar(50) NOT NULL,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	CONSTRAINT permisos_pkey PRIMARY KEY (id)
);


-- public.productos definition

-- Drop table

-- DROP TABLE public.productos;

CREATE TABLE public.productos (
	id bigserial PRIMARY KEY,
	nombre varchar(50) NOT NULL,
	precio numeric(10, 2) NOT NULL,
	stock int4 DEFAULT 0 NOT NULL DEFAULT,
	CONSTRAINT productos_pkey PRIMARY KEY (id)
);


-- public.promociones definition

-- Drop table

-- DROP TABLE public.promociones;

CREATE TABLE public.promociones (
	id bigserial PRIMARY KEY,
	nombre varchar(50) NOT NULL,
	descuento_porcentaje numeric(5, 2) NOT NULL,
	fecha_inicio date NOT NULL,
	fecha_fin date NOT NULL,
	CONSTRAINT promociones_pkey PRIMARY KEY (id)
);


-- public.proveedores definition

-- Drop table

-- DROP TABLE public.proveedores;

CREATE TABLE public.proveedores (
	id bigserial PRIMARY KEY,
	nombre varchar(50) NOT NULL,
	telefono varchar(10) NOT NULL,
	email varchar(50) NOT NULL,
	CONSTRAINT proveedores_pkey PRIMARY KEY (id)
);


-- public.roles definition

-- Drop table

-- DROP TABLE public.roles;

CREATE TABLE public.roles (
	id bigserial PRIMARY KEY,
	nombre varchar(50) NOT NULL,
	descripcion text,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id)
);


-- public.tipos_membresia definition

-- Drop table

-- DROP TABLE public.tipos_membresia;

CREATE TABLE public.tipos_membresia (
	id bigserial PRIMARY KEY,
	nombre varchar(50) NOT NULL,
	duracion_dias int4 NOT NULL,
	precio numeric(10, 2) NOT NULL,
	CONSTRAINT tipos_membresia_pkey PRIMARY KEY (id)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id bigserial PRIMARY KEEY,
	"name" varchar(50) NOT NULL,
	email varchar(50) NOT NULL,
	email_verified_at timestamp(0) NULL,
	"password" varchar(50) NOT NULL,
	remember_token varchar(50) NULL,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	two_factor_secret text NULL,
	two_factor_recovery_codes text NULL,
	two_factor_confirmed_at timestamp(0) NULL,
	CONSTRAINT users_email_unique UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


-- public.compras definition

-- Drop table

-- DROP TABLE public.compras;

CREATE TABLE public.compras (
	id bigserial PRIMARY KEY,
	proveedor_id int8 NOT NULL,
	fecha date DEFAULT CURRENT_DATE NOT NULL,
	total numeric(10, 2) DEFAULT '0'::numeric NOT NULL,
	CONSTRAINT compras_pkey PRIMARY KEY (id),
	CONSTRAINT compras_proveedor_id_foreign FOREIGN KEY (proveedor_id) REFERENCES public.proveedores(id) ON DELETE CASCADE
);


-- public.rol_permiso definition

-- Drop table

-- DROP TABLE public.rol_permiso;

CREATE TABLE public.rol_permiso (
	rol_id int8 NOT NULL,
	permiso_id int8 NOT NULL,
	CONSTRAINT rol_permiso_pkey PRIMARY KEY (rol_id, permiso_id),
	CONSTRAINT rol_permiso_permiso_id_foreign FOREIGN KEY (permiso_id) REFERENCES public.permisos(id) ON DELETE CASCADE,
	CONSTRAINT rol_permiso_rol_id_foreign FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON DELETE CASCADE
);


-- public.sucursales definition

-- Drop table

-- DROP TABLE public.sucursales;

CREATE TABLE public.sucursales (
	id bigserial PRIMARY KEY,
	franquicia_id int8 NOT NULL,
	nombre varchar(50) NOT NULL,
	direccion varchar(255) NOT NULL,
	ciudad varchar(50) NOT NULL,
	telefono varchar(10) NULL,
	activa bool DEFAULT true NOT NULL,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	CONSTRAINT sucursales_pkey PRIMARY KEY (id),
	CONSTRAINT sucursales_franquicia_id_foreign FOREIGN KEY (franquicia_id) REFERENCES public.franquicias(id) ON DELETE CASCADE
);


-- public.empleados definition

-- Drop table

-- DROP TABLE public.empleados;

CREATE TABLE public.empleados (
	id bigserial PRIMARY KEY,
	sucursal_id int8 NOT NULL,
	nombre varchar(50) NOT NULL,
	email varchar(50) NOT NULL,
	telefono varchar(10) NULL,
	salario numeric(10, 2) CHECK(salario >=0)NOT NULL,
	activo bool DEFAULT true NOT NULL,
	metadata json NULL,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	CONSTRAINT empleados_email_unique UNIQUE (email),
	CONSTRAINT empleados_pkey PRIMARY KEY (id),
	CONSTRAINT empleados_sucursal_id_foreign FOREIGN KEY (sucursal_id) REFERENCES public.sucursales(id) ON DELETE CASCADE
);


-- public.equipos definition

-- Drop table

-- DROP TABLE public.equipos;

CREATE TABLE public.equipos (
	id bigserial PRIMARY KEY,
	sucursal_id int8 NOT NULL,
	categoria_id int8 NOT NULL,
	nombre varchar(50) NOT NULL,
	estado varchar(50) DEFAULT 'activo'::character varying NOT NULL,
	CONSTRAINT equipos_pkey PRIMARY KEY (id),
	CONSTRAINT equipos_categoria_id_foreign FOREIGN KEY (categoria_id) REFERENCES public.categorias_equipo(id) ON DELETE CASCADE,
	CONSTRAINT equipos_sucursal_id_foreign FOREIGN KEY (sucursal_id) REFERENCES public.sucursales(id) ON DELETE CASCADE
);


-- public.horarios_sucursal definition

-- Drop table

-- DROP TABLE public.horarios_sucursal;

CREATE TABLE public.horarios_sucursal (
	id bigserial PRIMARY KEY,
	sucursal_id int8 NOT NULL,
	dia_semana varchar(10) NOT NULL,
	hora_apertura time(0) NOT NULL,
	hora_cierre time(0) NOT NULL,
	CONSTRAINT horarios_sucursal_pkey PRIMARY KEY (id),
	CONSTRAINT horarios_sucursal_sucursal_id_foreign FOREIGN KEY (sucursal_id) REFERENCES public.sucursales(id) ON DELETE CASCADE
);


-- public.mantenimientos definition

-- Drop table

-- DROP TABLE public.mantenimientos;

CREATE TABLE public.mantenimientos (
	id bigserial PRIMARY KEY,
	equipo_id int8 NOT NULL,
	fecha date NOT NULL,
	descripcion text NOT NULL,
	costo numeric(10, 2) DEFAULT '0'::numeric NOT NULL,
	CONSTRAINT mantenimientos_pkey PRIMARY KEY (id),
	CONSTRAINT mantenimientos_equipo_id_foreign FOREIGN KEY (equipo_id) REFERENCES public.equipos(id) ON DELETE CASCADE
);


-- public.miembros definition

-- Drop table

-- DROP TABLE public.miembros;

CREATE TABLE public.miembros (
	id bigserial PRIMARY KEY,
	sucursal_id int8 NOT NULL,
	nombre varchar(50) NOT NULL,
	email varchar(50) NULL,
	telefono varchar(10) NULL,
	fecha_nacimiento date NULL,
	genero varchar(10) CHECK(genero IN ('M','F','Otro'))NULL,
	estado bool DEFAULT true NOT NULL,
	datos_adicionales jsonb DEFAULT '{}'::jsonb NOT NULL,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	CONSTRAINT miembros_pkey PRIMARY KEY (id),
	CONSTRAINT miembros_sucursal_id_foreign FOREIGN KEY (sucursal_id) REFERENCES public.sucursales(id) ON DELETE CASCADE
);


-- public.notificaciones definition

-- Drop table

-- DROP TABLE public.notificaciones;

CREATE TABLE public.notificaciones (
	id bigserial PRIMARY KEY,
	miembro_id int8 NOT NULL,
	mensaje text NOT NULL,
	fecha timestamp(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	leida bool DEFAULT false NOT NULL,
	CONSTRAINT notificaciones_pkey PRIMARY KEY (id),
	CONSTRAINT notificaciones_miembro_id_foreign FOREIGN KEY (miembro_id) REFERENCES public.miembros(id) ON DELETE CASCADE
);


-- public.progreso_miembro definition

-- Drop table

-- DROP TABLE public.progreso_miembro;

CREATE TABLE public.progreso_miembro (
	id bigserial PRIMARY KEY,
	miembro_id int8 NOT NULL,
	fecha date DEFAULT CURRENT_DATE NOT NULL,
	metricas jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT progreso_miembro_pkey PRIMARY KEY (id),
	CONSTRAINT progreso_miembro_miembro_id_foreign FOREIGN KEY (miembro_id) REFERENCES public.miembros(id) ON DELETE CASCADE
);


-- public.rutinas definition

-- Drop table

-- DROP TABLE public.rutinas;

CREATE TABLE public.rutinas (
	id bigserial PRIMARY KEY,
	miembro_id int8 NOT NULL,
	entrenador_id int8 NOT NULL,
	nombre varchar(50) NOT NULL,
	fecha_inicio date DEFAULT CURRENT_DATE NOT NULL,
	CONSTRAINT rutinas_pkey PRIMARY KEY (id),
	CONSTRAINT rutinas_entrenador_id_foreign FOREIGN KEY (entrenador_id) REFERENCES public.empleados(id) ON DELETE CASCADE,
	CONSTRAINT rutinas_miembro_id_foreign FOREIGN KEY (miembro_id) REFERENCES public.miembros(id) ON DELETE CASCADE
);


-- public.ventas_productos definition

-- Drop table

-- DROP TABLE public.ventas_productos;

CREATE TABLE public.ventas_productos (
	id bigserial PRIMARY KEY,
	miembro_id int8 NOT NULL,
	producto_id int8 NOT NULL,
	cantidad int4 NOT NULL,
	total numeric(10, 2) NOT NULL,
	CONSTRAINT ventas_productos_pkey PRIMARY KEY (id),
	CONSTRAINT ventas_productos_miembro_id_foreign FOREIGN KEY (miembro_id) REFERENCES public.miembros(id) ON DELETE CASCADE,
	CONSTRAINT ventas_productos_producto_id_foreign FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE
);


-- public.asistencias_empleado definition

-- Drop table

-- DROP TABLE public.asistencias_empleado;

CREATE TABLE public.asistencias_empleado (
	id bigserial PRIMARY KEY,
	empleado_id int8 NOT NULL,
	fecha date NOT NULL,
	hora_entrada time(0) NULL,
	hora_salida time(0) NULL,
	CONSTRAINT asistencias_empleado_pkey PRIMARY KEY (id),
	CONSTRAINT asistencias_empleado_empleado_id_foreign FOREIGN KEY (empleado_id) REFERENCES public.empleados(id) ON DELETE CASCADE
);


-- public.checkins definition

-- Drop table

-- DROP TABLE public.checkins;

CREATE TABLE public.checkins (
	id bigserial PRIMARY KEY,
	miembro_id int8 NOT NULL,
	fecha timestamp(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT checkins_pkey PRIMARY KEY (id),
	CONSTRAINT checkins_miembro_id_foreign FOREIGN KEY (miembro_id) REFERENCES public.miembros(id) ON DELETE CASCADE
);


-- public.clases definition

-- Drop table

-- DROP TABLE public.clases;

CREATE TABLE public.clases (
	id bigserial PRIMARY KEY,
	sucursal_id int8 NOT NULL,
	entrenador_id int8 NOT NULL,
	nombre varchar(50) NOT NULL,
	capacidad int4 NOT NULL,
	fecha timestamp(0) NOT NULL,
	CONSTRAINT clases_pkey PRIMARY KEY (id),
	CONSTRAINT clases_entrenador_id_foreign FOREIGN KEY (entrenador_id) REFERENCES public.empleados(id) ON DELETE CASCADE,
	CONSTRAINT clases_sucursal_id_foreign FOREIGN KEY (sucursal_id) REFERENCES public.sucursales(id) ON DELETE CASCADE
);


-- public.contacto_emergencia definition

-- Drop table

-- DROP TABLE public.contacto_emergencia;

CREATE TABLE public.contacto_emergencia (
	id bigserial PRIMARY KEY,
	miembro_id int8 NOT NULL,
	nombre varchar(50) NOT NULL,
	telefono varchar(10) NOT NULL,
	relacion varchar(50) NOT NULL,
	CONSTRAINT contacto_emergencia_pkey PRIMARY KEY (id),
	CONSTRAINT contacto_emergencia_miembro_id_foreign FOREIGN KEY (miembro_id) REFERENCES public.miembros(id) ON DELETE CASCADE
);


-- public.detalle_compra definition

-- Drop table

-- DROP TABLE public.detalle_compra;

CREATE TABLE public.detalle_compra (
	id bigserial PRIMARY KEY,
	compra_id int8 NOT NULL,
	equipo_id int8 NOT NULL,
	cantidad int4 NOT NULL,
	precio_unitario numeric(10, 2) NOT NULL,
	CONSTRAINT detalle_compra_pkey PRIMARY KEY (id),
	CONSTRAINT detalle_compra_compra_id_foreign FOREIGN KEY (compra_id) REFERENCES public.compras(id) ON DELETE CASCADE,
	CONSTRAINT detalle_compra_equipo_id_foreign FOREIGN KEY (equipo_id) REFERENCES public.equipos(id) ON DELETE CASCADE
);


-- public.empleado_rol definition

-- Drop table

-- DROP TABLE public.empleado_rol;

CREATE TABLE public.empleado_rol (
	empleado_id int8 NOT NULL,
	rol_id int8 NOT NULL,
	CONSTRAINT empleado_rol_pkey PRIMARY KEY (empleado_id, rol_id),
	CONSTRAINT empleado_rol_empleado_id_foreign FOREIGN KEY (empleado_id) REFERENCES public.empleados(id) ON DELETE CASCADE,
	CONSTRAINT empleado_rol_rol_id_foreign FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON DELETE CASCADE
);


-- public.evaluaciones_fisicas definition

-- Drop table

-- DROP TABLE public.evaluaciones_fisicas;

CREATE TABLE public.evaluaciones_fisicas (
	id bigserial PRIMARY KEY,
	miembro_id int8 NOT NULL,
	fecha date DEFAULT CURRENT_DATE NOT NULL,
	resultados jsonb DEFAULT '{}'::jsonb NOT NULL,
	observaciones text NULL,
	CONSTRAINT evaluaciones_fisicas_pkey PRIMARY KEY (id),
	CONSTRAINT evaluaciones_fisicas_miembro_id_foreign FOREIGN KEY (miembro_id) REFERENCES public.miembros(id) ON DELETE CASCADE
);


-- public.membresias definition

-- Drop table

-- DROP TABLE public.membresias;

CREATE TABLE public.membresias (
	id bigserial PRIMARY KEY,
	miembro_id int8 NOT NULL,
	tipo_membresia_id int8 NOT NULL,
	fecha_inicio date NOT NULL,
	fecha_fin date NOT NULL,
	activa bool DEFAULT true NOT NULL,
	CONSTRAINT membresias_pkey PRIMARY KEY (id),
	CONSTRAINT membresias_miembro_id_foreign FOREIGN KEY (miembro_id) REFERENCES public.miembros(id) ON DELETE CASCADE,
	CONSTRAINT membresias_tipo_membresia_id_foreign FOREIGN KEY (tipo_membresia_id) REFERENCES public.tipos_membresia(id) ON DELETE CASCADE
);


-- public.pagos definition

-- Drop table

-- DROP TABLE public.pagos;

CREATE TABLE public.pagos (
	id bigserial PRIMARY KEY,
	membresia_id int8 NOT NULL,
	monto numeric(10, 2) NOT NULL,
	fecha_pago date DEFAULT CURRENT_DATE NOT NULL,
	metodo_pago varchar(50) NOT NULL,
	estado varchar(50) NOT NULL,
	CONSTRAINT pagos_pkey PRIMARY KEY (id),
	CONSTRAINT pagos_membresia_id_foreign FOREIGN KEY (membresia_id) REFERENCES public.membresias(id) ON DELETE CASCADE
);


-- public.reservas_clase definition

-- Drop table

-- DROP TABLE public.reservas_clase;

CREATE TABLE public.reservas_clase (
	id bigserial PRIMARY KEY,
	clase_id int8 NOT NULL,
	miembro_id int8 NOT NULL,
	estado varchar(50) DEFAULT 'reservado'::character varying NOT NULL,
	CONSTRAINT reservas_clase_pkey PRIMARY KEY (id),
	CONSTRAINT reservas_clase_clase_id_foreign FOREIGN KEY (clase_id) REFERENCES public.clases(id) ON DELETE CASCADE,
	CONSTRAINT reservas_clase_miembro_id_foreign FOREIGN KEY (miembro_id) REFERENCES public.miembros(id) ON DELETE CASCADE
);


-- public.rutina_ejercicio definition

-- Drop table

-- DROP TABLE public.rutina_ejercicio;

CREATE TABLE public.rutina_ejercicio (
	rutina_id int8 NOT NULL,
	ejercicio_id int8 NOT NULL,
	series int4 NOT NULL,
	repeticiones int4 NOT NULL,
	descanso_segundos int4 DEFAULT 60 NOT NULL,
	CONSTRAINT rutina_ejercicio_pkey PRIMARY KEY (rutina_id, ejercicio_id),
	CONSTRAINT rutina_ejercicio_ejercicio_id_foreign FOREIGN KEY (ejercicio_id) REFERENCES public.ejercicios(id) ON DELETE CASCADE,
	CONSTRAINT rutina_ejercicio_rutina_id_foreign FOREIGN KEY (rutina_id) REFERENCES public.rutinas(id) ON DELETE CASCADE
);


-- public.facturas definition

-- Drop table

-- DROP TABLE public.facturas;

CREATE TABLE public.facturas (
	id bigserial PRIMARY KEY,
	pago_id int8 NOT NULL,
	fecha timestamp(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	total numeric(10, 2) NOT NULL,
	CONSTRAINT facturas_pkey PRIMARY KEY (id),
	CONSTRAINT facturas_pago_id_foreign FOREIGN KEY (pago_id) REFERENCES public.pagos(id) ON DELETE CASCADE
);


-- public.membresia_promocion definition

-- Drop table

-- DROP TABLE public.membresia_promocion;

CREATE TABLE public.membresia_promocion (
	membresia_id int8 NOT NULL,
	promocion_id int8 NOT NULL,
	CONSTRAINT membresia_promocion_pkey PRIMARY KEY (membresia_id, promocion_id),
	CONSTRAINT membresia_promocion_membresia_id_foreign FOREIGN KEY (membresia_id) REFERENCES public.membresias(id) ON DELETE CASCADE,
	CONSTRAINT membresia_promocion_promocion_id_foreign FOREIGN KEY (promocion_id) REFERENCES public.promociones(id) ON DELETE CASCADE
);

-- public.vista_asistencia source

CREATE OR REPLACE VIEW public.vista_asistencia
AS SELECT mi.nombre,
    count(c.id) AS total_checkins
   FROM miembros mi
     LEFT JOIN checkins c ON mi.id = c.miembro_id
  GROUP BY mi.nombre;


-- public.vista_clases_ocupacion source

CREATE OR REPLACE VIEW public.vista_clases_ocupacion
AS SELECT c.nombre,
    c.capacidad,
    count(r.id) AS inscritos
   FROM clases c
     LEFT JOIN reservas_clase r ON c.id = r.clase_id
  GROUP BY c.id, c.nombre, c.capacidad;;


-- public.vista_ingresos source

CREATE OR REPLACE VIEW public.vista_ingresos
AS SELECT s.nombre AS sucursal,
    sum(p.monto) AS total_ingresos
   FROM pagos p
     JOIN membresias m ON p.membresia_id = m.id
     JOIN miembros mi ON m.miembro_id = mi.id
     JOIN sucursales s ON mi.sucursal_id = s.id
  GROUP BY s.nombre;


-- public.vista_membresias_activas source

CREATE OR REPLACE VIEW public.vista_membresias_activas
AS SELECT mi.id AS miembro_id,
    mi.nombre AS miembro,
    s.nombre AS sucursal,
    tm.nombre AS tipo_membresia,
    me.fecha_inicio,
    me.fecha_fin,
    me.fecha_fin - me.fecha_inicio AS duracion_dias
   FROM miembros mi
     JOIN membresias me ON mi.id = me.miembro_id
     JOIN tipos_membresia tm ON me.tipo_membresia_id = tm.id
     JOIN sucursales s ON mi.sucursal_id = s.id
  WHERE me.activa = true;


-- public.vista_ventas_productos source

CREATE OR REPLACE VIEW public.vista_ventas_productos
AS SELECT p.nombre AS producto,
    sum(v.cantidad) AS total_vendidos,
    sum(v.total) AS ingresos_totales
   FROM ventas_productos v
     JOIN productos p ON v.producto_id = p.id
  GROUP BY p.nombre
  ORDER BY (sum(v.total)) DESC;