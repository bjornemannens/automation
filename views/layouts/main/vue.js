Vue.component('node-list', {
  props:['nodes','intervals'],
  template: `
    <div>
      <node-container
      v-for="node in nodes"
      v-bind:key="node._id"
      v-bind:node="node"
      v-bind:intervals="intervals"
      ></node-container>
    </div>
  `
})

Vue.component('node-container', {
  props: ['node', 'intervals'],
  template: `
    <div class='nodeContainer'>
      <h1 class='nodeTitle'>{{ node.name }}</h1>
      <node-toggle-container
        title="Control"
        v-bind:toggle=node.control
        v-on:switch="switchControl(node, $event)"></node-toggle-container>
      <node-toggle-container
        title="Control power"
        v-bind:toggle=node.controlPower
        v-on:switch="switchControlPower(node, $event)"></node-toggle-container>
      <div class='clearfix'></div>

      <interval-list
        v-bind:intervals="intervals"
        v-bind:nodeId="node._id"
        v-on:create="createInterval($event, node)"
      ></interval-list>
    </div>
    `, methods : {
      createInterval : function (interval, node) {
        interval.nodeId = node._id;
        window.sendCreateInterval(interval);
      },
      switchControl : function (node, toggle) {
        newNode = Object.assign({}, node);
        newNode.power = toggle;
        sendNode(newNode);
      },
      switchControlPower : function (node, toggle) {
        newNode = Object.assign({}, node);
        newNode.controlPower = toggle;
        sendNode(newNode);
      }
    }
})

Vue.component('node-toggle-container', {
  props: ['title','toggle'],
  template: `
    <div class='nodeToggleContainer'>
      <h3 class='nodeToggleDescriptor'>{{title}} : </h3>
      <button
        class='nodeToggleButton'
        v-bind:style="{background: toggle ? 'blue' : 'red'}"
        v-on:click="$emit('switch', !toggle)">
          {{ toggle ? "On" : "Off"}}
        </button>
    </div>
  `
})

Vue.component('interval-list', {
  props: ['nodeId', 'intervals'],
  template: `
    <div>
    <interval-container
    v-for="interval in intervals"
    v-bind:key="interval._id"
    v-bind:interval="interval"
    v-if="interval.nodeId == nodeId"></interval-container>
    <interval-create
      v-on:create="$emit('create', $event)"></interval-create>
    <div class='clearfix'></div>
    </div>
  `
})

Vue.component('interval-container', {
  props: ['interval'],
  template: `
    <div class='intervalContainer'>
      <p1 class='intervalDescriptor'>Start: {{ interval.start }}</p1>
      <p1 class='intervalDescriptor'>End: {{ interval.end }}</p1>
      <div class='clearfix'></div>
      <button
        class='intervalRemove'
        v-on:click="remove(interval._id, interval._rev)">Remove</button>
      <div class='clearfix'></div>
    </div>
  `, methods : {
    remove : function (id, _rev) {
      window.sendRemoveInterval(id, _rev);
    }
  }
})

Vue.component('interval-create', {
  template: `
    <div class='intervalCreate'>
      <time-edit
        v-bind:time="start"
      ></time-edit>
      <p1 class='intervalCreateTimeDescriptor'>-</p1>
      <time-edit
        v-bind:time="end"></time-edit>
      <button
        v-on:click="$emit('create',
          {
            start: start.h*60 + start.m,
            end: end.h*60 + end.m
          })"
      >Create</button>
    </div>
  `, data: function (){
    return {
      start: {h:0, m:0},
      end: {h:0, m:0}
    }
  }
})

Vue.component('time-edit', {
  props : ['time'],
  template: `
    <div class='timeContainer'>
      <div class='time'>
        <button
        class='intervalCreateEdit'
        v-on:click="time.h = (time.h + 1) % 24">+</button>
        <p1 class='intervalCreateTimeDescriptor'> {{indexedTime(time.h)}} </p1>
        <button
        class='intervalCreateEdit'
        v-on:click="time.h = time.h == 0 ? 23 : time.h - 1">-</button>
      </div>
        <p1 class='cp'> : </p1>
      <div class='time'>
        <button
        class='intervalCreateEdit'
        v-on:click="time.m = (time.m + 5) % 60">+</button>
        <p1 class='intervalCreateTimeDescriptor'> {{indexedTime(time.m)}} </p1>
        <button
        class='intervalCreateEdit'
        v-on:click="time.m = time.m == 0 ? 55 : time.m - 5">-</button>
      </div>
    </div>
  `,
  methods: {
    indexedTime: function(raw){
      if (raw < 10){
        return '0' + raw;
      }else {
        return raw.toString()
      }
    },
    getHours: function (minutes) {
      return (minutes - getMinutes(minutes))/60;
    },
    getMinutes: function (minutes) {
      return minutes % 60;
    }
  }
})


function getHours(minutes) {
  var h = (minutes - (minutes % 60)) / 60;
  if (h < 10) {
    return '0' + h;
  } else {
    return h.toString();
  }
}

function getM (minutes) {
  var m = minutes % 60;
  if (m < 10) {
    return '0'+m;
  }else {
    return m.toString();
  }
}

var vue = new Vue({
  el: '#nodes',
  data : {
    nodes : [],
    intervals: []
  },
  computed: {
    hMIntervals: function () {
      var res = [];
      this.intervals.map(interval =>
        res.push(
          {
          _id: interval._id,
          _rev: interval._rev,
          nodeId: interval.nodeId,
          start: getHours(interval.start) + " : " + getM(interval.start),
          end: getHours(interval.end) + " : " + getM(interval.end)
        })
      );
      return res;
    }
  }
});
