const $ = (s) => document.querySelector(s);
const bd = (t) => ({ Disponible: 'ok', Activo: 'ok', Pagado: 'ok', Terminado: 'ok', Completado: 'ok', Mantenimiento: 'wa', 'En proceso': 'wa', Pendiente: 'wa', 'En uso': 'in', Cancelado: 'er' }[t] || 'in');
const badge = (t) => '<span class="b ' + bd(t) + '">' + t + '</span>';
const money = (n) => '$' + n.toLocaleString('es-CO');
const bat = (p) => '<div class="bat"><s><i style="width:' + p + '%;background:' + (p < 20 ? 'var(--er)' : p < 50 ? 'var(--wa)' : 'var(--ok)') + '"></i></s>' + p + '%</div>';

const data = {
  patinetas: [
    ['Pat-001', 'Model-1', 90, 'Disponible', 'Sede 1'],
    ['Pat-002', 'Model-2', 95, 'Disponible', 'Sede 1'],
    ['Pat-005', 'Model-5', 2, 'Mantenimiento', 'Sede 1'],
    ['Pat-006', 'Model-1', 70, 'En uso', 'Sede 1'],
    ['Pat-007', 'Model-5', 92, 'Disponible', 'Sede 2'],
    ['Pat-008', 'Model-2', 97, 'Disponible', 'Sede 2'],
    ['Pat-003', 'Model-3', 10, 'Mantenimiento', 'Sede 2'],
    ['Pat-004', 'Model-4', 70, 'En uso', 'Sede 2']
  ],
  alquileres: [
    ['Juan Perez', 'Pat-001', '14:30', 'En curso', 8000, 'Activo', 'Sede 1'],
    ['Maria Gomez', 'Pat-002', '10:30', 'En curso', 8000, 'Activo', 'Sede 1'],
    ['Carlos Oliveira', 'Pat-003', '09:05', '10:20', 8000, 'Completado', 'Sede 2'],
    ['Camilo Martinez', 'Pat-004', '07:30', 'En curso', 8000, 'Activo', 'Sede 2']
  ],
  pagos: [
    ['Pag-001', 'Juan Perez', 'ALQ-001', '14/10/2026', 'Tarjeta', 'Pagado', 8000],
    ['Pag-002', 'Carlos Oliveira', 'ALQ-002', '12/10/2026', 'Efectivo', 'Pendiente', 8000],
    ['Pag-003', 'Camilo Martinez', 'ALQ-003', '17/10/2026', 'Tarjeta', 'Pagado', 8000]
  ],
  clientes: [
    ['Juan Perez', 'juan@gmail.com', 'Sede 1', 'Activo'],
    ['Carlos Oliveira', 'carlos@hotmail.com', 'Sede 2', 'Activo'],
    ['Camilo Martinez', 'camilo@yahoo.com', 'Sede 2', 'Activo']
  ],
  personal: [
    ['Laura Rios', 'laura@pati.co', 'Operador', 'Sede 1', 'Activo'],
    ['Carl Johnson', 'carl@pati.co', 'Tecnico', 'Sede 2', 'Activo'],
    ['Ana Torres', 'ana@pati.co', 'Administrador', 'General', 'Activo']
  ],
  mantenimiento: [
    ['Pat-003', 'Carl Johnson', 'Preventivo', '14/10/2026', 'Pendiente', 'Sede 2'],
    ['Pat-005', 'Luis Lopez', 'Correctivo', '12/10/2026', 'En proceso', 'Sede 1'],
    ['Pat-010', 'Luis Lopez', 'Inspeccion', '17/10/2026', 'Terminado', 'Sede 1']
  ]
};

const labels = { inicio: 'Inicio', inventario: 'Inventario', alquileres: 'Alquileres', pagos: 'Pagos', usuarios: 'Usuarios / Personal', mantenimiento: 'Mantenimiento', configuracion: 'Configuracion' };

function tbl(h, rows) {
  var ths = h.map(function(x) { return '<th>' + x + '</th>'; }).join('');
  var trs = rows.map(function(r) { return '<tr>' + r.map(function(c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('');
  return '<div class="tw"><table><thead><tr>' + ths + '</tr></thead><tbody>' + trs + '</tbody></table></div>';
}

function invRender() {
  const f = $('#fs') ? $('#fs').value : '';
  const sedes = ['Sede 1', 'Sede 2'].filter(function(s) { return !f || f === s; });
  
  var html = sedes.map(function(s) {
    var items = data.patinetas.filter(function(r) { return r[4] === s; }).map(function(r) {
      return [r[0], r[1], bat(r[2]), badge(r[3]), '<button class="btn g" onclick="cambiarEstadoPatineta(\'' + r[0] + '\')">Cambiar Estado</button>'];
    });
    return '<div class="card" style="margin-bottom:14px"><h3>Estado de las patinetas - ' + s + '</h3>' + tbl(['Patineta', 'Modelo', 'Bateria', 'Estado', 'Acciones'], items) + '</div>';
  }).join('');
  
  $('#inv').innerHTML = html;
}

const views = {
  inicio: function() {
    const disp = data.patinetas.filter(function(s) { return s[3] === 'Disponible'; }).length;
    const uso = data.patinetas.filter(function(s) { return s[3] === 'En uso'; }).length;
    const mant = data.patinetas.filter(function(s) { return s[3] === 'Mantenimiento'; }).length;

    return {
      t: 'Inicio', s: 'Resumen general de la operacion',
      h: '<div class="grid g4">' +
        '<div class="card kpi"><span class="l">Patinetas totales</span><b>' + data.patinetas.length + '</b><span>Flota registrada</span></div>' +
        '<div class="card kpi"><span class="l">Disponibles</span><b>' + disp + '</b><span>Listas para servicio</span></div>' +
        '<div class="card kpi"><span class="l">En uso</span><b>' + uso + '</b><span>Alquileres activos</span></div>' +
        '<div class="card kpi"><span class="l">Mantenimiento</span><b>' + mant + '</b><span>En taller</span></div>' +
      '</div>' +
      '<div class="grid g2">' +
        '<div class="card"><h3>Estado actual de patinetas <button class="btn g" data-go="inventario">Ver todo</button></h3>' +
          tbl(['Patineta', 'Modelo', 'Bateria', 'Estado', 'Sede'], data.patinetas.slice(0, 4).map(function(r) { return [r[0], r[1], bat(r[2]), badge(r[3]), r[4]]; })) +
        '</div>' +
        '<div class="card"><h3>Acciones Rapidas</h3>' +
          '<button class="qa" data-act="nuevo_alquiler"><b>+ Nuevo Alquiler</b><span>Registrar salida de patineta</span></button>' +
          '<button class="qa" data-act="add"><b>+ Registrar Patineta</b><span>Agregar unidad al inventario</span></button>' +
          '<button class="qa" data-act="add_client"><b>+ Registrar Cliente</b><span>Crear nuevo cliente</span></button>' +
          '<button class="qa" data-go="pagos"><b>Revisar Pagos</b><span>Caja y recaudacion</span></button>' +
        '</div>' +
      '</div>'
    };
  },
  inventario: function() {
    return {
      t: 'Inventario', s: 'Gestion de patinetas por sede',
      a: '<select id="fs"><option value="">Todas las sedes</option><option>Sede 1</option><option>Sede 2</option></select> <button class="btn" data-act="add">+ Registrar Patineta</button>',
      h: '<div id="inv"></div>', after: invRender
    };
  },
  alquileres: function() {
    var items = data.alquileres.map(function(r, i) {
      var btn = r[5] === 'Activo' ? '<button class="btn" onclick="cobrarAlquiler(' + i + ')">Finalizar / Cobrar</button>' : '<span>Finalizado</span>';
      return [r[0], r[1], r[2], r[3], money(r[4]), badge(r[5]), btn];
    });
    return {
      t: 'Alquileres', s: 'Control de alquileres en curso y cobros',
      a: '<button class="btn" data-act="nuevo_alquiler">+ Registrar Alquiler</button>',
      h: '<div class="grid g4">' +
        '<div class="card kpi"><span class="l">Alquileres activos</span><b>' + data.alquileres.filter(function(r) { return r[5] === 'Activo'; }).length + '</b></div>' +
        '<div class="card kpi"><span class="l">Completados hoy</span><b>' + data.alquileres.filter(function(r) { return r[5] === 'Completado'; }).length + '</b></div>' +
      '</div>' +
      '<div class="card"><h3>Lista de Alquileres</h3>' + tbl(['Cliente', 'Patineta', 'Inicio', 'Fin', 'Costo', 'Estado', 'Accion'], items) + '</div>'
    };
  },
  pagos: function() {
    var rec = data.pagos.reduce(function(a, b) { return a + (b[5] === 'Pagado' ? b[6] : 0); }, 0);
    return {
      t: 'Pagos', s: 'Historial de ingresos y caja',
      h: '<div class="grid g2">' +
        '<div class="card"><h3>Historial de Pagos</h3>' + tbl(['Pago', 'Cliente', 'Ref', 'Fecha', 'Metodo', 'Estado', 'Monto'], data.pagos.map(function(r) { return [r[0], r[1], r[2], r[3], r[4], badge(r[5]), money(r[6])]; })) + '</div>' +
        '<div class="card"><h3>Resumen de Caja</h3><div class="kpi"><span class="l">Recaudado Hoy</span><b>' + money(rec) + '</b></div></div>' +
      '</div>'
    };
  },
  usuarios: function() {
    return {
      t: 'Gestion de Usuarios y Personal', s: 'Modulos separados para Clientes externos y Personal de la empresa',
      a: '<button class="btn" data-act="add_client">+ Nuevo Cliente</button> <button class="btn g" data-act="add_staff">+ Nuevo Empleado</button>',
      h: '<div class="card" style="margin-bottom:16px"><h3>Clientes Registrados (Usuarios Externos)</h3>' +
        tbl(['Nombre Cliente', 'Correo Electronico', 'Sede Frecuente', 'Estado'], data.clientes.map(function(r) { return [r[0], r[1], r[2], badge(r[3])]; })) +
      '</div>' +
      '<div class="card"><h3>Personal de la Empresa (Operadores, Tecnicos y Administradores)</h3>' +
        tbl(['Nombre Empleado', 'Correo Institucional', 'Rol / Cargo', 'Sede Asignada', 'Estado'], data.personal.map(function(r) { return [r[0], r[1], r[2], r[3], badge(r[4])]; })) +
      '</div>'
    };
  },
  mantenimiento: function() {
    return {
      t: 'Mantenimiento', s: 'Estado tecnico y reparaciones',
      h: '<div class="card"><h3>Ordenes de Mantenimiento</h3>' + tbl(['Patineta', 'Tecnico Responsable', 'Tipo', 'Fecha', 'Estado', 'Sede'], data.mantenimiento.map(function(r) { return [r[0], r[1], r[2], r[3], badge(r[4]), r[5]]; })) + '</div>'
    };
  },
  configuracion: function() {
    return {
      t: 'Configuracion', s: 'Parametros del sistema',
      h: '<div class="card"><h3>Preferencias Generales</h3><p>Sedes activas: Sede 1, Sede 2</p><br><p>Tarifa Base: $8.000 / hora</p></div>'
    };
  }
};

function go(k) {
  const v = views[k]();
  var navBtns = Object.keys(labels).map(function(x) {
    return '<button data-go="' + x + '" ' + (x === k ? 'aria-current="page"' : '') + '>' + labels[x] + '</button>';
  }).join('');
  
  $('#nav').innerHTML = navBtns;
  $('#main').innerHTML = '<header><div><h1>' + v.t + '</h1><p>' + v.s + '</p></div><span class="sp"></span>' + (v.a || '') + '<div class="av" title="Administrador">AD</div></header>' + v.h;
  if (v.after) { v.after(); $('#fs').onchange = invRender; }
  scrollTo(0, 0);
}

function modal(t, body, onSave) {
  $('#dform').innerHTML = '<h3>' + t + '</h3>' + body + '<div class="row"><button type="button" class="btn g" onclick="$(\'#dlg\').close()">Cancelar</button><button type="button" class="btn" id="btnSaveModal">Guardar</button></div>';
  $('#dlg').showModal();
  $('#btnSaveModal').onclick = function() { onSave(); $('#dlg').close(); };
}

document.addEventListener('click', function(e) {
  const g = e.target.closest('[data-go]'); if (g) return go(g.dataset.go);
  const a = e.target.closest('[data-act]'); if (!a) return;
  const k = a.dataset.act;

  if (k === 'add') {
    modal('Registrar Patineta', '<label>Codigo Patineta</label><input id="m_code" placeholder="PAT-010"><label>Modelo</label><input id="m_mod" placeholder="Model-1"><label>Sede</label><select id="m_sede"><option>Sede 1</option><option>Sede 2</option></select>', function() {
      const code = $('#m_code').value || 'PAT-' + Math.floor(Math.random()*100);
      data.patinetas.push([code, $('#m_mod').value || 'Model-1', 100, 'Disponible', $('#m_sede').value]);
      go('inventario');
    });
  } else if (k === 'add_client') {
    modal('Registrar Nuevo Cliente', '<label>Nombre Completo</label><input id="mc_nom" placeholder="Ej. Pedro Gomez"><label>Correo Electronico</label><input id="mc_mail" placeholder="pedro@gmail.com"><label>Sede Preferida</label><select id="mc_sede"><option>Sede 1</option><option>Sede 2</option></select>', function() {
      data.clientes.push([$('#mc_nom').value || 'Cliente Nuevo', $('#mc_mail').value || 'correo@gmail.com', $('#mc_sede').value, 'Activo']);
      go('usuarios');
    });
  } else if (k === 'add_staff') {
    modal('Registrar Nuevo Empleado', '<label>Nombre Completo</label><input id="ms_nom" placeholder="Ej. Roberto Carlos"><label>Correo Institucional</label><input id="ms_mail" placeholder="roberto@pati.co"><label>Rol / Cargo</label><select id="ms_rol"><option>Operador</option><option>Tecnico</option><option>Administrador</option></select><label>Sede Asignada</label><select id="ms_sede"><option>Sede 1</option><option>Sede 2</option></select>', function() {
      data.personal.push([$('#ms_nom').value || 'Empleado Nuevo', $('#ms_mail').value || 'emp@pati.co', $('#ms_rol').value, $('#ms_sede').value, 'Activo']);
      go('usuarios');
    });
  } else if (k === 'nuevo_alquiler') {
    const disp = data.patinetas.filter(function(s) { return s[3] === 'Disponible'; });
    if(disp.length === 0) return alert('No hay patinetas disponibles en este momento.');
    
    var optsCli = data.clientes.map(function(c) { return '<option>' + c[0] + '</option>'; }).join('');
    var optsPat = disp.map(function(s) { return '<option value="' + s[0] + '">' + s[0] + ' (' + s[4] + ' - Bateria ' + s[2] + '%)</option>'; }).join('');

    modal('Registrar Nuevo Alquiler', '<label>Seleccionar Cliente</label><select id="ma_cli">' + optsCli + '</select><label>Seleccionar Patineta Disponible</label><select id="ma_pat">' + optsPat + '</select>', function() {
      const patId = $('#ma_pat').value;
      const clientNom = $('#ma_cli').value;
      const patObj = data.patinetas.find(function(s) { return s[0] === patId; });
      
      if(patObj) patObj[3] = 'En uso';
      data.alquileres.unshift([clientNom, patId, '15:00', 'En curso', 8000, 'Activo', patObj ? patObj[4] : 'Sede 1']);
      go('alquileres');
    });
  }
});

window.cobrarAlquiler = function(idx) {
  const r = data.alquileres[idx];
  r[3] = '16:15';
  r[5] = 'Completado';
  
  const pat = data.patinetas.find(function(s) { return s[0] === r[1]; });
  if(pat) pat[3] = 'Disponible';
  
  data.pagos.unshift(['Pag-00' + (data.pagos.length + 1), r[0], 'ALQ-00' + idx, '18/10/2026', 'Efectivo', 'Pagado', r[4]]);
  alert('Alquiler de ' + r[0] + ' finalizado con exito. Valor cobrado: $8.000 COP');
  go('alquileres');
};

window.cambiarEstadoPatineta = function(code) {
  const pat = data.patinetas.find(function(s) { return s[0] === code; });
  if(!pat) return;
  const nuevo = prompt('Estado actual de ' + code + ': ' + pat[3] + '\nEscribe el nuevo estado (Disponible, Mantenimiento, En uso):', pat[3]);
  if(nuevo && ['Disponible','Mantenimiento','En uso'].includes(nuevo)) {
    pat[3] = nuevo;
    go('inventario');
  }
};

go('inicio');