
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const currentPageId = writable("test");
    const currentModal = writable("");
    const sidenavOpen = writable(true);

    const deviceStore = writable([]);

    const token = writable("");

    const apiRequest = async(method, url, request) => {
        try {
            const response = await fetch(url, {
                method: method,
                cache: 'no-cache',
                headers: {'Content-Type': 'application/json', "Authorization": "Bearer " + get_store_value(token)},
                body: JSON.stringify(request)
                });
            const json = await response.json();
            if(json.detail == "Could not validate credentials") token.set("");
            return json
        } catch(error) {
            return false
        }
    };

    const get = (url, request) => apiRequest("get", url, request);
    const post = (url, request) => apiRequest("post", url, request);
    const put = (url, request) => apiRequest("put", url, request);
    const deleteRequest = (url, request) =>  apiRequest("delete", url, request);

    const API ={
        get,
        post,
        put,
        delete: deleteRequest
    };

    const loadDevices = async () => {
        const devices = await API.get("../devices");
        if(devices && Array.isArray(devices)) deviceStore.set(devices);
        else deviceStore.set([]);
    };

    const addDevice = async (device) => {
        const result = await API.post("../devices", device);
        if(result) return loadDevices()
        else return false
    };

    const updateDevice = async (device) => {
        const result = await API.put("../devices", device);
        if(result) return loadDevices()
        else return false
    };

    const removeDevice = async (device) => {
        const result = await API.delete("../devices", device);
        if(result) loadDevices();
        else return false
    };

    /* src/components/gui/Icon.svelte generated by Svelte v3.46.4 */

    const file$g = "src/components/gui/Icon.svelte";

    // (108:0) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Icon not found!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(108:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (104:0) {#if displayIcon}
    function create_if_block$4(ctx) {
    	let svg;
    	let raw_value = /*displayIcon*/ ctx[0].svg + "";
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			attr_dev(svg, "viewBox", svg_viewBox_value = "" + (/*displayIcon*/ ctx[0].x + " " + /*displayIcon*/ ctx[0].y + " " + /*displayIcon*/ ctx[0].box1 + " " + /*displayIcon*/ ctx[0].box2));
    			add_location(svg, file$g, 104, 4, 8210);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			svg.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*displayIcon*/ 1 && raw_value !== (raw_value = /*displayIcon*/ ctx[0].svg + "")) svg.innerHTML = raw_value;
    			if (dirty & /*displayIcon*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "" + (/*displayIcon*/ ctx[0].x + " " + /*displayIcon*/ ctx[0].y + " " + /*displayIcon*/ ctx[0].box1 + " " + /*displayIcon*/ ctx[0].box2))) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(104:0) {#if displayIcon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*displayIcon*/ ctx[0]) return create_if_block$4;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let displayIcon;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { id } = $$props;

    	let icons = [
    		{
    			id: "air",
    			x: 10,
    			y: 0,
    			box1: 512,
    			box2: 512,
    			svg: `<path d="M8 224h344c59.8 0 106.8-54.6 93.8-116.7-7.6-36.3-36.9-65.6-73.2-73.2-59.1-12.3-111.5 29.8-116.3 85.4-.4 4.6 3.5 8.4 8 8.4h16.2c4.2 0 7.4-3.3 7.9-7.4 4.3-36.6 39.5-63.8 78.7-54.8 23.1 5.3 41.8 24.1 47.2 47.2 9.6 41.8-22.1 79.1-62.3 79.1H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8zm148 32H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h149.1c33.4 0 63.3 24.4 66.5 57.6 3.7 38.1-26.3 70.4-63.7 70.4-32.8 0-59.9-24.8-63.6-56.5-.5-4.2-3.7-7.4-7.9-7.4h-16c-4.6 0-8.4 3.9-8 8.4 4.3 49.1 45.5 87.6 95.6 87.6 54 0 97.6-44.6 96-98.9-1.6-52.7-47.5-93.2-100-93.2zm239.3 0H243.8c10.5 9.2 19.4 19.9 26.4 32h126.2c41.8 0 79.1 30.4 83.2 72 4.7 47.7-32.9 88-79.6 88-36.5 0-67.3-24.5-76.9-58-1-3.5-4-6-7.7-6h-16.1c-5 0-9 4.6-7.9 9.5C302.9 443 347 480 400 480c63 0 113.9-52 112-115.4-1.9-61.3-55.4-108.6-116.7-108.6z"/>`
    		},
    		{
    			id: "bars",
    			x: 0,
    			y: -20,
    			box1: 448,
    			box2: 512,
    			svg: `<path d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"/>`
    		},
    		{
    			id: "bell",
    			x: -35,
    			y: 0,
    			box1: 512,
    			box2: 512,
    			svg: `<path d="M439.39 362.29c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71zM67.53 368c21.22-27.97 44.42-74.33 44.53-159.42 0-.2-.06-.38-.06-.58 0-61.86 50.14-112 112-112s112 50.14 112 112c0 .2-.06.38-.06.58.11 85.1 23.31 131.46 44.53 159.42H67.53zM224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64z"/>`
    		},
    		{
    			id: "close",
    			x: 0,
    			y: 0,
    			box1: 512,
    			box2: 512,
    			svg: `<path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"/>`
    		},
    		{
    			id: "device",
    			x: 0,
    			y: 0,
    			box1: 512,
    			box2: 512,
    			svg: `<path d="M608 128H416a32 32 0 0 0-32 32v320a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V160a32 32 0 0 0-32-32zm0 352H416V160h192zM96 32h384v64h32V32a32 32 0 0 0-32-32H96a32 32 0 0 0-32 32v256H16a16 16 0 0 0-16 16v16a64.14 64.14 0 0 0 63.91 64H352v-32H63.91A32 32 0 0 1 32 320h320v-32H96z"/>`
    		},
    		{
    			id: "elipsis",
    			x: -225,
    			y: -50,
    			box1: 512,
    			box2: 512,
    			svg: `<path d="M32 224c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zM0 136c0 17.7 14.3 32 32 32s32-14.3 32-32-14.3-32-32-32-32 14.3-32 32zm0 240c0 17.7 14.3 32 32 32s32-14.3 32-32-14.3-32-32-32-32 14.3-32 32z"/>`
    		},
    		{
    			id: "fan",
    			x: -30,
    			y: 0,
    			box1: 512,
    			box2: 512,
    			svg: `<path d="M224 209.42A14.58 14.58 0 1 0 238.58 224 14.58 14.58 0 0 0 224 209.42ZM448 224C448 100.29 347.71 0 224 0S0 100.29 0 224c0 118.31 91.79 215 208 223.19V480H88a24 24 0 0 0-24 24 8 8 0 0 0 8 8h304a8 8 0 0 0 8-8 24 24 0 0 0-24-24H240v-32.81C356.21 439 448 342.31 448 224ZM224 413.54c-104.51 0-189.54-85-189.54-189.54S119.49 34.46 224 34.46s189.54 85 189.54 189.54S328.51 413.54 224 413.54Zm159.21-170.21a101.68 101.68 0 0 0-140.28-94.15L222 93.23c-8-21.36-34.11-32.76-56-20.11a101.76 101.76 0 0 0-37.24 139 99.86 99.86 0 0 0 25.93 29.45l-38.1 46.28a39 39 0 0 0 10.69 58.59 101.54 101.54 0 0 0 50.64 13.61c28.88 0 66.61-13.37 88.27-50.9A99.43 99.43 0 0 0 278.68 272c12.35 2 31.56 5.23 59.13 9.83 21.02 3.5 45.4-11.89 45.4-38.5Zm-39.65 6.94c-1.62 0-76.85-12.91-78.95-12.91h-.19c-10 0-17.43 8.59-17 18.47a68.27 68.27 0 0 1-9 37.3c-19.49 33.76-54.1 34.9-59.81 34.9a69.57 69.57 0 0 1-35.48-9.38 7 7 0 0 1-1.91-10.49l49-59.48c7.82-9.5 2.77-21.62-5.83-26.06a68.35 68.35 0 0 1-28-26.54 69.75 69.75 0 0 1 25.53-95.27 7 7 0 0 1 10.08 3.64l27 72a16.94 16.94 0 0 0 25.2 8 69.67 69.67 0 0 1 107 58.9c.01 3.65-2.57 6.92-7.64 6.92Z"/>`
    		},
    		{
    			id: "home",
    			x: 0,
    			y: 0,
    			box1: 512,
    			box2: 512,
    			svg: `<path d="M573.48 219.91 512 170.42V72a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v72.6L310.6 8a35.85 35.85 0 0 0-45.19 0L2.53 219.91a6.71 6.71 0 0 0-1 9.5l14.2 17.5a6.82 6.82 0 0 0 9.6 1L64 216.72V496a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V216.82l38.8 31.29a6.83 6.83 0 0 0 9.6-1l14.19-17.5a7.14 7.14 0 0 0-1.11-9.7zM336 480h-96V320h96zm144 0H368V304a16 16 0 0 0-16-16H224a16 16 0 0 0-16 16v176H96V190.92l187.71-151.4a6.63 6.63 0 0 1 8.4 0L480 191z"/>`
    		},
    		{
    			id: "light",
    			x: 0,
    			y: 0,
    			box1: 512,
    			box2: 512,
    			svg: `<path d="M272 192.74V0h-32v192.74C117.11 200.21 17.4 292.62.32 411.64-2.43 430.83 13 448 32.56 448h145.06a80 80 0 0 0 156.76 0h145.06c19.56 0 35-17.18 32.24-36.37C494.6 292.62 394.89 200.21 272 192.74ZM256 480a48 48 0 0 1-45.24-32h90.48A48 48 0 0 1 256 480ZM32 416.18C47.72 306.62 144 224 256 224s208.28 82.61 223.44 192Z"/>`
    		},
    		{
    			id: "plus",
    			x: 0,
    			y: 0,
    			box1: 512,
    			box2: 512,
    			svg: `<path d="M384 250v12c0 6.6-5.4 12-12 12h-98v98c0 6.6-5.4 12-12 12h-12c-6.6 0-12-5.4-12-12v-98h-98c-6.6 0-12-5.4-12-12v-12c0-6.6 5.4-12 12-12h98v-98c0-6.6 5.4-12 12-12h12c6.6 0 12 5.4 12 12v98h98c6.6 0 12 5.4 12 12zm120 6c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-32 0c0-119.9-97.3-216-216-216-119.9 0-216 97.3-216 216 0 119.9 97.3 216 216 216 119.9 0 216-97.3 216-216z"/>`
    		},
    		{
    			id: "question",
    			x: 0,
    			y: 0,
    			box1: 512,
    			box2: 512,
    			svg: `<path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"/>`
    		},
    		{
    			id: "sensor",
    			x: 0,
    			y: 0,
    			box1: 512,
    			box2: 512,
    			svg: `<path d="M528 144a16.16 16.16 0 0 0 7.16-1.68l64-32a16 16 0 0 0-14.32-28.63l-64 32A16 16 0 0 0 528 144Zm96 96h-96a16 16 0 1 0 0 32h96a16 16 0 0 0 0-32ZM384 32H64A64 64 0 0 0 0 96v320a64 64 0 0 0 64 64h320a64 64 0 0 0 64-64V96a64 64 0 0 0-64-64Zm32 384a32 32 0 0 1-32 32H64a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32h320a32 32 0 0 1 32 32ZM112 128a16 16 0 0 0-16 16v128a16 16 0 0 0 32 0V144a16 16 0 0 0-16-16Zm64 0a16 16 0 0 0-16 16v128a16 16 0 0 0 32 0V144a16 16 0 0 0-16-16Zm64 0a16 16 0 0 0-16 16v128a16 16 0 0 0 32 0V144a16 16 0 0 0-16-16Zm359.16 273.7-64-32a16 16 0 0 0-14.32 28.63l64 32a16 16 0 0 0 14.32-28.63Z"/>`
    		}
    	];

    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({ id, icons, displayIcon });

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('icons' in $$props) $$invalidate(2, icons = $$props.icons);
    		if ('displayIcon' in $$props) $$invalidate(0, displayIcon = $$props.displayIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*id*/ 2) {
    			$$invalidate(0, displayIcon = icons.find(i => i.id === id));
    		}
    	};

    	return [displayIcon, id];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { id: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[1] === undefined && !('id' in props)) {
    			console.warn("<Icon> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/gui/buttons/IconButton.svelte generated by Svelte v3.46.4 */
    const file$f = "src/components/gui/buttons/IconButton.svelte";

    function create_fragment$h(ctx) {
    	let button;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { id: /*id*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			attr_dev(button, "class", "svelte-100j572");
    			toggle_class(button, "xs", /*size*/ ctx[1] == "xs");
    			toggle_class(button, "sm", /*size*/ ctx[1] == "sm");
    			toggle_class(button, "md", /*size*/ ctx[1] == "md");
    			toggle_class(button, "lg", /*size*/ ctx[1] == "lg");
    			add_location(button, file$f, 7, 0, 107);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const icon_changes = {};
    			if (dirty & /*id*/ 1) icon_changes.id = /*id*/ ctx[0];
    			icon.$set(icon_changes);

    			if (dirty & /*size*/ 2) {
    				toggle_class(button, "xs", /*size*/ ctx[1] == "xs");
    			}

    			if (dirty & /*size*/ 2) {
    				toggle_class(button, "sm", /*size*/ ctx[1] == "sm");
    			}

    			if (dirty & /*size*/ 2) {
    				toggle_class(button, "md", /*size*/ ctx[1] == "md");
    			}

    			if (dirty & /*size*/ 2) {
    				toggle_class(button, "lg", /*size*/ ctx[1] == "lg");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconButton', slots, []);
    	let { id } = $$props;
    	let { size = "md" } = $$props;
    	const writable_props = ['id', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconButton> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ Icon, id, size });

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, size, click_handler];
    }

    class IconButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { id: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconButton",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<IconButton> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/gui/buttons/FlatButton.svelte generated by Svelte v3.46.4 */

    const file$e = "src/components/gui/buttons/FlatButton.svelte";

    function create_fragment$g(ctx) {
    	let button;
    	let span;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-1w225mq");
    			add_location(span, file$e, 5, 4, 43);
    			attr_dev(button, "class", "svelte-1w225mq");
    			add_location(button, file$e, 4, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FlatButton', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FlatButton> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots, click_handler];
    }

    class FlatButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlatButton",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/components/gui/buttons/TextButton.svelte generated by Svelte v3.46.4 */

    const file$d = "src/components/gui/buttons/TextButton.svelte";

    function create_fragment$f(ctx) {
    	let button;
    	let span;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-rrrx81");
    			add_location(span, file$d, 5, 4, 43);
    			attr_dev(button, "class", "svelte-rrrx81");
    			add_location(button, file$d, 4, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextButton', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TextButton> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots, click_handler];
    }

    class TextButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextButton",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/components/modals/Modal.svelte generated by Svelte v3.46.4 */
    const file$c = "src/components/modals/Modal.svelte";

    // (24:10) <TextButton on:click="{() => $currentModal = ""}">
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancel");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(24:10) <TextButton on:click=\\\"{() => $currentModal = \\\"\\\"}\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:10) <FlatButton on:click>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Save");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(25:10) <FlatButton on:click>",
    		ctx
    	});

    	return block;
    }

    // (26:10) {#if deleteEnabled}
    function create_if_block$3(ctx) {
    	let flatbutton;
    	let current;

    	flatbutton = new FlatButton({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	flatbutton.$on("click", /*click_handler_3*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(flatbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(flatbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const flatbutton_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				flatbutton_changes.$$scope = { dirty, ctx };
    			}

    			flatbutton.$set(flatbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flatbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flatbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(flatbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(26:10) {#if deleteEnabled}",
    		ctx
    	});

    	return block;
    }

    // (27:10) <FlatButton on:click="{() => {dispatch('delete')}}">
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Delete");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(27:10) <FlatButton on:click=\\\"{() => {dispatch('delete')}}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div5;
    	let div4;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let iconbutton;
    	let t2;
    	let div2;
    	let t3;
    	let div3;
    	let textbutton;
    	let t4;
    	let flatbutton;
    	let t5;
    	let current;

    	iconbutton = new IconButton({
    			props: { id: "close", size: "md" },
    			$$inline: true
    		});

    	iconbutton.$on("click", /*click_handler_1*/ ctx[5]);
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	textbutton = new TextButton({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	textbutton.$on("click", /*click_handler_2*/ ctx[6]);

    	flatbutton = new FlatButton({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	flatbutton.$on("click", /*click_handler*/ ctx[7]);
    	let if_block = /*deleteEnabled*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			create_component(iconbutton.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			if (default_slot) default_slot.c();
    			t3 = space();
    			div3 = element("div");
    			create_component(textbutton.$$.fragment);
    			t4 = space();
    			create_component(flatbutton.$$.fragment);
    			t5 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "title svelte-17uqhot");
    			add_location(div0, file$c, 16, 10, 518);
    			attr_dev(div1, "class", "modal-header svelte-17uqhot");
    			add_location(div1, file$c, 15, 8, 481);
    			attr_dev(div2, "class", "modal-content svelte-17uqhot");
    			add_location(div2, file$c, 19, 8, 658);
    			attr_dev(div3, "class", "modal-footer svelte-17uqhot");
    			add_location(div3, file$c, 22, 8, 733);
    			attr_dev(div4, "class", "modal-window svelte-17uqhot");
    			add_location(div4, file$c, 14, 4, 446);
    			attr_dev(div5, "class", "modal svelte-17uqhot");
    			add_location(div5, file$c, 13, 0, 422);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			mount_component(iconbutton, div1, null);
    			append_dev(div4, t2);
    			append_dev(div4, div2);

    			if (default_slot) {
    				default_slot.m(div2, null);
    			}

    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			mount_component(textbutton, div3, null);
    			append_dev(div3, t4);
    			mount_component(flatbutton, div3, null);
    			append_dev(div3, t5);
    			if (if_block) if_block.m(div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			const textbutton_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				textbutton_changes.$$scope = { dirty, ctx };
    			}

    			textbutton.$set(textbutton_changes);
    			const flatbutton_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				flatbutton_changes.$$scope = { dirty, ctx };
    			}

    			flatbutton.$set(flatbutton_changes);

    			if (/*deleteEnabled*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*deleteEnabled*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbutton.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(textbutton.$$.fragment, local);
    			transition_in(flatbutton.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbutton.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(textbutton.$$.fragment, local);
    			transition_out(flatbutton.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(iconbutton);
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(textbutton);
    			destroy_component(flatbutton);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $currentModal;
    	validate_store(currentModal, 'currentModal');
    	component_subscribe($$self, currentModal, $$value => $$invalidate(2, $currentModal = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	let { title = "" } = $$props;
    	let { deleteEnabled = false } = $$props;
    	const dispatch = createEventDispatcher();
    	const writable_props = ['title', 'deleteEnabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	const click_handler_1 = () => set_store_value(currentModal, $currentModal = "", $currentModal);
    	const click_handler_2 = () => set_store_value(currentModal, $currentModal = "", $currentModal);

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_3 = () => {
    		dispatch('delete');
    	};

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('deleteEnabled' in $$props) $$invalidate(1, deleteEnabled = $$props.deleteEnabled);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		FlatButton,
    		TextButton,
    		IconButton,
    		currentModal,
    		createEventDispatcher,
    		title,
    		deleteEnabled,
    		dispatch,
    		$currentModal
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('deleteEnabled' in $$props) $$invalidate(1, deleteEnabled = $$props.deleteEnabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		title,
    		deleteEnabled,
    		$currentModal,
    		dispatch,
    		slots,
    		click_handler_1,
    		click_handler_2,
    		click_handler,
    		click_handler_3,
    		$$scope
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { title: 0, deleteEnabled: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get title() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deleteEnabled() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set deleteEnabled(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/gui/inputs/InputField.svelte generated by Svelte v3.46.4 */

    const file$b = "src/components/gui/inputs/InputField.svelte";

    function create_fragment$d(ctx) {
    	let span;
    	let t0;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			input = element("input");
    			attr_dev(span, "class", "svelte-1y04cxi");
    			add_location(span, file$b, 6, 0, 65);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-1y04cxi");
    			add_location(input, file$b, 7, 0, 86);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(input, "change", /*change_handler*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputField', slots, []);
    	let { title } = $$props;
    	let { value } = $$props;
    	const writable_props = ['title', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputField> was created with unknown prop '${key}'`);
    	});

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ title, value });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, title, change_handler, input_input_handler];
    }

    class InputField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { title: 1, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputField",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<InputField> was created without expected prop 'title'");
    		}

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<InputField> was created without expected prop 'value'");
    		}
    	}

    	get title() {
    		throw new Error("<InputField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<InputField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<InputField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InputField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/gui/inputs/Select.svelte generated by Svelte v3.46.4 */

    const file$a = "src/components/gui/inputs/Select.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (9:4) {#each options as option}
    function create_each_block$3(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[4] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*option*/ ctx[4];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-1osmxq5");
    			add_location(option, file$a, 9, 8, 180);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 4 && t_value !== (t_value = /*option*/ ctx[4] + "")) set_data_dev(t, t_value);

    			if (dirty & /*options*/ 4 && option_value_value !== (option_value_value = /*option*/ ctx[4])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(9:4) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let span;
    	let t0;
    	let t1;
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = /*options*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "svelte-1osmxq5");
    			add_location(span, file$a, 6, 0, 93);
    			attr_dev(select, "class", "svelte-1osmxq5");
    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[3].call(select));
    			add_location(select, file$a, 7, 0, 114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);

    			if (dirty & /*options*/ 4) {
    				each_value = /*options*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*value, options*/ 5) {
    				select_option(select, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Select', slots, []);
    	let { title } = $$props;
    	let { value } = $$props;
    	let { options = [] } = $$props;
    	const writable_props = ['title', 'value', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Select> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(0, value);
    		$$invalidate(2, options);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    	};

    	$$self.$capture_state = () => ({ title, value, options });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, title, options, select_change_handler];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { title: 1, value: 0, options: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<Select> was created without expected prop 'title'");
    		}

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<Select> was created without expected prop 'value'");
    		}
    	}

    	get title() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/modals/DeviceModal.svelte generated by Svelte v3.46.4 */

    // (14:0) <Modal {title} on:click="{() => {dispatch('save', device)}}" on:delete="{() => {dispatch('delete')}}" {deleteEnabled}>
    function create_default_slot$3(ctx) {
    	let inputfield;
    	let updating_value;
    	let t0;
    	let select0;
    	let updating_value_1;
    	let t1;
    	let select1;
    	let updating_value_2;
    	let current;

    	function inputfield_value_binding(value) {
    		/*inputfield_value_binding*/ ctx[4](value);
    	}

    	let inputfield_props = { title: "Name" };

    	if (/*device*/ ctx[0].name !== void 0) {
    		inputfield_props.value = /*device*/ ctx[0].name;
    	}

    	inputfield = new InputField({ props: inputfield_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputfield, 'value', inputfield_value_binding));

    	function select0_value_binding(value) {
    		/*select0_value_binding*/ ctx[5](value);
    	}

    	let select0_props = {
    		options: ["light", "fan", "air"],
    		title: "Type"
    	};

    	if (/*device*/ ctx[0].category !== void 0) {
    		select0_props.value = /*device*/ ctx[0].category;
    	}

    	select0 = new Select({ props: select0_props, $$inline: true });
    	binding_callbacks.push(() => bind(select0, 'value', select0_value_binding));

    	function select1_value_binding(value) {
    		/*select1_value_binding*/ ctx[6](value);
    	}

    	let select1_props = {
    		options: [-1, 2, 3, 4, 5],
    		title: "Socket"
    	};

    	if (/*device*/ ctx[0].socket !== void 0) {
    		select1_props.value = /*device*/ ctx[0].socket;
    	}

    	select1 = new Select({ props: select1_props, $$inline: true });
    	binding_callbacks.push(() => bind(select1, 'value', select1_value_binding));

    	const block = {
    		c: function create() {
    			create_component(inputfield.$$.fragment);
    			t0 = space();
    			create_component(select0.$$.fragment);
    			t1 = space();
    			create_component(select1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputfield, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(select0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(select1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputfield_changes = {};

    			if (!updating_value && dirty & /*device*/ 1) {
    				updating_value = true;
    				inputfield_changes.value = /*device*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			inputfield.$set(inputfield_changes);
    			const select0_changes = {};

    			if (!updating_value_1 && dirty & /*device*/ 1) {
    				updating_value_1 = true;
    				select0_changes.value = /*device*/ ctx[0].category;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			select0.$set(select0_changes);
    			const select1_changes = {};

    			if (!updating_value_2 && dirty & /*device*/ 1) {
    				updating_value_2 = true;
    				select1_changes.value = /*device*/ ctx[0].socket;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			select1.$set(select1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputfield.$$.fragment, local);
    			transition_in(select0.$$.fragment, local);
    			transition_in(select1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputfield.$$.fragment, local);
    			transition_out(select0.$$.fragment, local);
    			transition_out(select1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputfield, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(select0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(select1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(14:0) <Modal {title} on:click=\\\"{() => {dispatch('save', device)}}\\\" on:delete=\\\"{() => {dispatch('delete')}}\\\" {deleteEnabled}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				title: /*title*/ ctx[1],
    				deleteEnabled: /*deleteEnabled*/ ctx[2],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("click", /*click_handler*/ ctx[7]);
    	modal.$on("delete", /*delete_handler*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};
    			if (dirty & /*title*/ 2) modal_changes.title = /*title*/ ctx[1];
    			if (dirty & /*deleteEnabled*/ 4) modal_changes.deleteEnabled = /*deleteEnabled*/ ctx[2];

    			if (dirty & /*$$scope, device*/ 513) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let deleteEnabled;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DeviceModal', slots, []);
    	let { device } = $$props;
    	let { title = device.id ? "Device settings" : "Add a new device" } = $$props;
    	const dispatch = createEventDispatcher();
    	const writable_props = ['device', 'title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DeviceModal> was created with unknown prop '${key}'`);
    	});

    	function inputfield_value_binding(value) {
    		if ($$self.$$.not_equal(device.name, value)) {
    			device.name = value;
    			$$invalidate(0, device);
    		}
    	}

    	function select0_value_binding(value) {
    		if ($$self.$$.not_equal(device.category, value)) {
    			device.category = value;
    			$$invalidate(0, device);
    		}
    	}

    	function select1_value_binding(value) {
    		if ($$self.$$.not_equal(device.socket, value)) {
    			device.socket = value;
    			$$invalidate(0, device);
    		}
    	}

    	const click_handler = () => {
    		dispatch('save', device);
    	};

    	const delete_handler = () => {
    		dispatch('delete');
    	};

    	$$self.$$set = $$props => {
    		if ('device' in $$props) $$invalidate(0, device = $$props.device);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({
    		Modal,
    		InputField,
    		Select,
    		createEventDispatcher,
    		device,
    		title,
    		dispatch,
    		deleteEnabled
    	});

    	$$self.$inject_state = $$props => {
    		if ('device' in $$props) $$invalidate(0, device = $$props.device);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('deleteEnabled' in $$props) $$invalidate(2, deleteEnabled = $$props.deleteEnabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*device*/ 1) {
    			$$invalidate(2, deleteEnabled = device.id && device.socket === -1 ? true : false);
    		}
    	};

    	return [
    		device,
    		title,
    		deleteEnabled,
    		dispatch,
    		inputfield_value_binding,
    		select0_value_binding,
    		select1_value_binding,
    		click_handler,
    		delete_handler
    	];
    }

    class DeviceModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { device: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DeviceModal",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*device*/ ctx[0] === undefined && !('device' in props)) {
    			console.warn("<DeviceModal> was created without expected prop 'device'");
    		}
    	}

    	get device() {
    		throw new Error("<DeviceModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set device(value) {
    		throw new Error("<DeviceModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<DeviceModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<DeviceModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Devices.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file$9 = "src/pages/Devices.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (62:65) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Unplugged");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(62:65) {:else}",
    		ctx
    	});

    	return block;
    }

    // (62:20) {#if device.socket >= 1}
    function create_if_block_1$1(ctx) {
    	let t0;
    	let t1_value = /*device*/ ctx[7].socket + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Plug ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$deviceStore*/ 4 && t1_value !== (t1_value = /*device*/ ctx[7].socket + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(62:20) {#if device.socket >= 1}",
    		ctx
    	});

    	return block;
    }

    // (57:12) {#each $deviceStore as device}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let div;
    	let icon;
    	let t0;
    	let td1;
    	let t1_value = /*device*/ ctx[7].name + "";
    	let t1;
    	let t2;
    	let td2;
    	let t3_value = /*device*/ ctx[7].active + "";
    	let t3;
    	let t4;
    	let td3;
    	let t5;
    	let td4;
    	let iconbutton;
    	let t6;
    	let current;

    	icon = new Icon({
    			props: { id: /*device*/ ctx[7].category },
    			$$inline: true
    		});

    	function select_block_type(ctx, dirty) {
    		if (/*device*/ ctx[7].socket >= 1) return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	iconbutton = new IconButton({
    			props: { id: "elipsis", size: "lg" },
    			$$inline: true
    		});

    	iconbutton.$on("click", function () {
    		if (is_function(/*editDevice*/ ctx[4](/*device*/ ctx[7]))) /*editDevice*/ ctx[4](/*device*/ ctx[7]).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			div = element("div");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			td1 = element("td");
    			t1 = text(t1_value);
    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td3 = element("td");
    			if_block.c();
    			t5 = space();
    			td4 = element("td");
    			create_component(iconbutton.$$.fragment);
    			t6 = space();
    			attr_dev(div, "class", "icon svelte-rmq28l");
    			add_location(div, file$9, 58, 20, 1685);
    			attr_dev(td0, "class", "svelte-rmq28l");
    			add_location(td0, file$9, 58, 16, 1681);
    			attr_dev(td1, "class", "svelte-rmq28l");
    			add_location(td1, file$9, 59, 16, 1760);
    			attr_dev(td2, "class", "svelte-rmq28l");
    			add_location(td2, file$9, 60, 16, 1799);
    			attr_dev(td3, "class", "svelte-rmq28l");
    			add_location(td3, file$9, 61, 16, 1840);
    			attr_dev(td4, "class", "svelte-rmq28l");
    			add_location(td4, file$9, 62, 16, 1933);
    			attr_dev(tr, "class", "svelte-rmq28l");
    			add_location(tr, file$9, 57, 12, 1660);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, div);
    			mount_component(icon, div, null);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			if_block.m(td3, null);
    			append_dev(tr, t5);
    			append_dev(tr, td4);
    			mount_component(iconbutton, td4, null);
    			append_dev(tr, t6);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const icon_changes = {};
    			if (dirty & /*$deviceStore*/ 4) icon_changes.id = /*device*/ ctx[7].category;
    			icon.$set(icon_changes);
    			if ((!current || dirty & /*$deviceStore*/ 4) && t1_value !== (t1_value = /*device*/ ctx[7].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*$deviceStore*/ 4) && t3_value !== (t3_value = /*device*/ ctx[7].active + "")) set_data_dev(t3, t3_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td3, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(iconbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(iconbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(icon);
    			if_block.d();
    			destroy_component(iconbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(57:12) {#each $deviceStore as device}",
    		ctx
    	});

    	return block;
    }

    // (70:0) {#if $currentModal == "deviceModal"}
    function create_if_block$2(ctx) {
    	let devicemodal;
    	let current;

    	devicemodal = new DeviceModal({
    			props: { device: /*targetDevice*/ ctx[0] },
    			$$inline: true
    		});

    	devicemodal.$on("save", /*saveDevice*/ ctx[5]);
    	devicemodal.$on("delete", /*deleteDevice*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(devicemodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(devicemodal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const devicemodal_changes = {};
    			if (dirty & /*targetDevice*/ 1) devicemodal_changes.device = /*targetDevice*/ ctx[0];
    			devicemodal.$set(devicemodal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(devicemodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(devicemodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(devicemodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(70:0) {#if $currentModal == \\\"deviceModal\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div3;
    	let div0;
    	let span;
    	let t1;
    	let div2;
    	let table;
    	let tr;
    	let td0;
    	let t3;
    	let td1;
    	let t5;
    	let td2;
    	let t7;
    	let td3;
    	let t9;
    	let td4;
    	let div1;
    	let iconbutton;
    	let t10;
    	let div3_intro;
    	let t11;
    	let if_block_anchor;
    	let current;

    	iconbutton = new IconButton({
    			props: { id: "plus", size: "lg" },
    			$$inline: true
    		});

    	iconbutton.$on("click", /*newDevice*/ ctx[3]);
    	let each_value = /*$deviceStore*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*$currentModal*/ ctx[1] == "deviceModal" && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "Devices";
    			t1 = space();
    			div2 = element("div");
    			table = element("table");
    			tr = element("tr");
    			td0 = element("td");
    			td0.textContent = "Device";
    			t3 = space();
    			td1 = element("td");
    			td1.textContent = "Name";
    			t5 = space();
    			td2 = element("td");
    			td2.textContent = "Active";
    			t7 = space();
    			td3 = element("td");
    			td3.textContent = "Socket";
    			t9 = space();
    			td4 = element("td");
    			div1 = element("div");
    			create_component(iconbutton.$$.fragment);
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t11 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(span, "class", "title svelte-rmq28l");
    			add_location(span, file$9, 45, 8, 1257);
    			attr_dev(div0, "class", "header svelte-rmq28l");
    			add_location(div0, file$9, 44, 4, 1228);
    			attr_dev(td0, "class", "svelte-rmq28l");
    			add_location(td0, file$9, 50, 14, 1378);
    			attr_dev(td1, "class", "svelte-rmq28l");
    			add_location(td1, file$9, 51, 14, 1408);
    			attr_dev(td2, "class", "svelte-rmq28l");
    			add_location(td2, file$9, 52, 14, 1436);
    			attr_dev(td3, "class", "svelte-rmq28l");
    			add_location(td3, file$9, 53, 14, 1466);
    			attr_dev(div1, "class", "action svelte-rmq28l");
    			add_location(div1, file$9, 54, 18, 1500);
    			attr_dev(td4, "class", "svelte-rmq28l");
    			add_location(td4, file$9, 54, 14, 1496);
    			attr_dev(tr, "class", "svelte-rmq28l");
    			add_location(tr, file$9, 49, 12, 1359);
    			attr_dev(table, "class", "svelte-rmq28l");
    			add_location(table, file$9, 48, 8, 1339);
    			attr_dev(div2, "class", "container svelte-rmq28l");
    			add_location(div2, file$9, 47, 4, 1307);
    			attr_dev(div3, "class", "wrapper svelte-rmq28l");
    			add_location(div3, file$9, 43, 0, 1185);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, span);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, table);
    			append_dev(table, tr);
    			append_dev(tr, td0);
    			append_dev(tr, t3);
    			append_dev(tr, td1);
    			append_dev(tr, t5);
    			append_dev(tr, td2);
    			append_dev(tr, t7);
    			append_dev(tr, td3);
    			append_dev(tr, t9);
    			append_dev(tr, td4);
    			append_dev(td4, div1);
    			mount_component(iconbutton, div1, null);
    			append_dev(table, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			insert_dev(target, t11, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*editDevice, $deviceStore*/ 20) {
    				each_value = /*$deviceStore*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(table, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*$currentModal*/ ctx[1] == "deviceModal") {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$currentModal*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbutton.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			if (!div3_intro) {
    				add_render_callback(() => {
    					div3_intro = create_in_transition(div3, fly, { y: -25 });
    					div3_intro.start();
    				});
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbutton.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(iconbutton);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t11);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $currentModal;
    	let $deviceStore;
    	validate_store(currentModal, 'currentModal');
    	component_subscribe($$self, currentModal, $$value => $$invalidate(1, $currentModal = $$value));
    	validate_store(deviceStore, 'deviceStore');
    	component_subscribe($$self, deviceStore, $$value => $$invalidate(2, $deviceStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Devices', slots, []);

    	onMount(function () {
    		loadDevices();
    	});

    	let targetDevice = {};

    	const newDevice = () => {
    		$$invalidate(0, targetDevice = {
    			name: "",
    			category: "air",
    			active: false,
    			socket: -1
    		});

    		set_store_value(currentModal, $currentModal = "deviceModal", $currentModal);
    	};

    	const editDevice = device => {
    		$$invalidate(0, targetDevice = device);
    		set_store_value(currentModal, $currentModal = "deviceModal", $currentModal);
    	};

    	const saveDevice = device => {
    		device = device.detail;

    		// update existing device
    		if (device.id) updateDevice(device); else // create new device
    		addDevice(device);

    		console.log(device);
    		set_store_value(currentModal, $currentModal = "", $currentModal);
    	};

    	const deleteDevice = () => {
    		removeDevice(targetDevice);
    		set_store_value(currentModal, $currentModal = "", $currentModal);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Devices> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		fly,
    		deviceStore,
    		currentModal,
    		loadDevices,
    		addDevice,
    		updateDevice,
    		removeDevice,
    		Icon,
    		IconButton,
    		DeviceModal,
    		targetDevice,
    		newDevice,
    		editDevice,
    		saveDevice,
    		deleteDevice,
    		$currentModal,
    		$deviceStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('targetDevice' in $$props) $$invalidate(0, targetDevice = $$props.targetDevice);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		targetDevice,
    		$currentModal,
    		$deviceStore,
    		newDevice,
    		editDevice,
    		saveDevice,
    		deleteDevice
    	];
    }

    class Devices extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Devices",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/pages/Sensors.svelte generated by Svelte v3.46.4 */
    const file$8 = "src/pages/Sensors.svelte";

    function create_fragment$9(ctx) {
    	let div9;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let div4;
    	let h30;
    	let t4;
    	let span0;
    	let t6;
    	let div3;
    	let t7;
    	let hr0;
    	let t8;
    	let div6;
    	let h31;
    	let t9;
    	let span1;
    	let t11;
    	let div5;
    	let t12;
    	let div8;
    	let div7;
    	let t14;
    	let div16;
    	let div11;
    	let div10;
    	let t16;
    	let div13;
    	let h32;
    	let t17;
    	let span2;
    	let t19;
    	let div12;
    	let t20;
    	let hr1;
    	let t21;
    	let div15;
    	let h33;
    	let t22;
    	let span3;
    	let t24;
    	let div14;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Clima Interior";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "xx";
    			t3 = space();
    			div4 = element("div");
    			h30 = element("h3");
    			t4 = text("Temperatura");
    			span0 = element("span");
    			span0.textContent = "26C";
    			t6 = text("\n        Temperatura interior esta en rango optimo.\n        ");
    			div3 = element("div");
    			t7 = space();
    			hr0 = element("hr");
    			t8 = space();
    			div6 = element("div");
    			h31 = element("h3");
    			t9 = text("Humedad");
    			span1 = element("span");
    			span1.textContent = "68%";
    			t11 = text("\n        Humedad interior esta en rango optimo.\n        ");
    			div5 = element("div");
    			t12 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div7.textContent = "Last 24 Hours";
    			t14 = space();
    			div16 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			div10.textContent = "Clima Exterior";
    			t16 = space();
    			div13 = element("div");
    			h32 = element("h3");
    			t17 = text("Temperatura");
    			span2 = element("span");
    			span2.textContent = "19C";
    			t19 = text("\n        Temperatura exterior esta baja.\n        ");
    			div12 = element("div");
    			t20 = space();
    			hr1 = element("hr");
    			t21 = space();
    			div15 = element("div");
    			h33 = element("h3");
    			t22 = text("Humedad");
    			span3 = element("span");
    			span3.textContent = "82%";
    			t24 = text("\n        Humedad exterior esta alta.\n        ");
    			div14 = element("div");
    			attr_dev(div0, "class", "header-title svelte-kqo9o4");
    			add_location(div0, file$8, 7, 8, 133);
    			attr_dev(div1, "class", "header-action svelte-kqo9o4");
    			add_location(div1, file$8, 10, 8, 210);
    			attr_dev(div2, "class", "header spaced svelte-kqo9o4");
    			add_location(div2, file$8, 6, 4, 97);
    			attr_dev(span0, "class", "badge svelte-kqo9o4");
    			add_location(span0, file$8, 15, 23, 328);
    			attr_dev(h30, "class", "svelte-kqo9o4");
    			add_location(h30, file$8, 15, 8, 313);
    			attr_dev(div3, "class", "progress svelte-kqo9o4");
    			add_location(div3, file$8, 17, 8, 423);
    			attr_dev(div4, "class", "section svelte-kqo9o4");
    			add_location(div4, file$8, 14, 4, 283);
    			attr_dev(hr0, "class", "divider svelte-kqo9o4");
    			add_location(hr0, file$8, 19, 4, 467);
    			attr_dev(span1, "class", "badge svelte-kqo9o4");
    			add_location(span1, file$8, 21, 19, 533);
    			attr_dev(h31, "class", "svelte-kqo9o4");
    			add_location(h31, file$8, 21, 8, 522);
    			attr_dev(div5, "class", "progress svelte-kqo9o4");
    			add_location(div5, file$8, 23, 8, 624);
    			attr_dev(div6, "class", "section svelte-kqo9o4");
    			add_location(div6, file$8, 20, 4, 492);
    			attr_dev(div7, "class", "header-title svelte-kqo9o4");
    			add_location(div7, file$8, 26, 8, 697);
    			attr_dev(div8, "class", "header svelte-kqo9o4");
    			add_location(div8, file$8, 25, 4, 668);
    			attr_dev(div9, "class", "window svelte-kqo9o4");
    			add_location(div9, file$8, 5, 0, 72);
    			attr_dev(div10, "class", "header-title svelte-kqo9o4");
    			add_location(div10, file$8, 34, 8, 838);
    			attr_dev(div11, "class", "header svelte-kqo9o4");
    			add_location(div11, file$8, 33, 4, 809);
    			attr_dev(span2, "class", "badge svelte-kqo9o4");
    			add_location(span2, file$8, 39, 23, 967);
    			attr_dev(h32, "class", "svelte-kqo9o4");
    			add_location(h32, file$8, 39, 8, 952);
    			attr_dev(div12, "class", "progress svelte-kqo9o4");
    			add_location(div12, file$8, 41, 8, 1051);
    			attr_dev(div13, "class", "section svelte-kqo9o4");
    			add_location(div13, file$8, 38, 4, 922);
    			attr_dev(hr1, "class", "divider svelte-kqo9o4");
    			add_location(hr1, file$8, 43, 4, 1095);
    			attr_dev(span3, "class", "badge svelte-kqo9o4");
    			add_location(span3, file$8, 45, 19, 1161);
    			attr_dev(h33, "class", "svelte-kqo9o4");
    			add_location(h33, file$8, 45, 8, 1150);
    			attr_dev(div14, "class", "progress svelte-kqo9o4");
    			add_location(div14, file$8, 47, 8, 1241);
    			attr_dev(div15, "class", "section svelte-kqo9o4");
    			add_location(div15, file$8, 44, 4, 1120);
    			attr_dev(div16, "class", "window svelte-kqo9o4");
    			add_location(div16, file$8, 32, 0, 784);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div9, t3);
    			append_dev(div9, div4);
    			append_dev(div4, h30);
    			append_dev(h30, t4);
    			append_dev(h30, span0);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div9, t7);
    			append_dev(div9, hr0);
    			append_dev(div9, t8);
    			append_dev(div9, div6);
    			append_dev(div6, h31);
    			append_dev(h31, t9);
    			append_dev(h31, span1);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div9, t12);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div11);
    			append_dev(div11, div10);
    			append_dev(div16, t16);
    			append_dev(div16, div13);
    			append_dev(div13, h32);
    			append_dev(h32, t17);
    			append_dev(h32, span2);
    			append_dev(div13, t19);
    			append_dev(div13, div12);
    			append_dev(div16, t20);
    			append_dev(div16, hr1);
    			append_dev(div16, t21);
    			append_dev(div16, div15);
    			append_dev(div15, h33);
    			append_dev(h33, t22);
    			append_dev(h33, span3);
    			append_dev(div15, t24);
    			append_dev(div15, div14);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(div16);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sensors', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sensors> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fly });
    	return [];
    }

    class Sensors extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sensors",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/pages/Video.svelte generated by Svelte v3.46.4 */
    const file$7 = "src/pages/Video.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "img/photo.jpeg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Video");
    			attr_dev(img, "class", "svelte-4i7t6d");
    			add_location(img, file$7, 5, 4, 90);
    			add_location(div, file$7, 4, 0, 63);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fly, { y: -25 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Video', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Video> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fly });
    	return [];
    }

    class Video extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Video",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    const login = async (username, password) => {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);
        try {
            const result = await fetch("../login", {
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: formData
            });
            if(!result.ok) return "Incorrect username or password"
            const json = await result.json();
            token.set(json.access_token);
        }catch(error) {
            return "Error: Connection error."
        }
    };

    /* src/pages/Test.svelte generated by Svelte v3.46.4 */
    const file$6 = "src/pages/Test.svelte";

    // (19:0) <FlatButton on:click={test}>
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Lets test it");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(19:0) <FlatButton on:click={test}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let t0;
    	let t1;
    	let form;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let flatbutton;
    	let current;
    	let mounted;
    	let dispose;

    	flatbutton = new FlatButton({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	flatbutton.$on("click", /*test*/ ctx[3]);

    	const block = {
    		c: function create() {
    			t0 = text(/*$token*/ ctx[2]);
    			t1 = space();
    			form = element("form");
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			create_component(flatbutton.$$.fragment);
    			attr_dev(input0, "placeholder", "username");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$6, 14, 4, 338);
    			attr_dev(input1, "placeholder", "password");
    			attr_dev(input1, "type", "password");
    			add_location(input1, file$6, 15, 4, 407);
    			add_location(form, file$6, 13, 0, 295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, input0);
    			set_input_value(input0, /*username*/ ctx[0]);
    			append_dev(form, t2);
    			append_dev(form, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			insert_dev(target, t3, anchor);
    			mount_component(flatbutton, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*test*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$token*/ 4) set_data_dev(t0, /*$token*/ ctx[2]);

    			if (dirty & /*username*/ 1 && input0.value !== /*username*/ ctx[0]) {
    				set_input_value(input0, /*username*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}

    			const flatbutton_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				flatbutton_changes.$$scope = { dirty, ctx };
    			}

    			flatbutton.$set(flatbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flatbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flatbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    			if (detaching) detach_dev(t3);
    			destroy_component(flatbutton, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $token;
    	validate_store(token, 'token');
    	component_subscribe($$self, token, $$value => $$invalidate(2, $token = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Test', slots, []);
    	let username, password;

    	const test = async () => {
    		login(username, password);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Test> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(0, username);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		FlatButton,
    		token,
    		login,
    		username,
    		password,
    		test,
    		$token
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [username, password, $token, test, input0_input_handler, input1_input_handler];
    }

    class Test extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Test",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const pageList = [
        {id: "home", label: "Home", icon: "home", component: Video},
        {id: "devices", label: "Devices", icon: "device", component: Devices},
        {id: "sensors", label: "Sensors", icon: "sensor", component: Sensors},
        {id: "test", label: "Test", icon: "sensor", component: Test}
    ];

    /* src/components/gui/buttons/DropdownButton.svelte generated by Svelte v3.46.4 */

    const file$5 = "src/components/gui/buttons/DropdownButton.svelte";

    function create_fragment$6(ctx) {
    	let button;
    	let div1;
    	let t;
    	let div0;
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z");
    			add_location(path, file$5, 9, 39, 151);
    			attr_dev(svg, "viewBox", "0 0 320 512");
    			add_location(svg, file$5, 9, 12, 124);
    			attr_dev(div0, "class", "xs svelte-14pzj45");
    			add_location(div0, file$5, 8, 8, 95);
    			attr_dev(div1, "class", "inline svelte-14pzj45");
    			add_location(div1, file$5, 6, 4, 44);
    			attr_dev(button, "class", "svelte-14pzj45");
    			add_location(button, file$5, 5, 0, 22);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div1, t);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DropdownButton', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DropdownButton> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots, click_handler];
    }

    class DropdownButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownButton",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/layout/Header.svelte generated by Svelte v3.46.4 */
    const file$4 = "src/components/layout/Header.svelte";

    // (23:12) <DropdownButton>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Omen");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(23:12) <DropdownButton>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let nav;
    	let ul;
    	let li0;
    	let t1;
    	let li1;
    	let iconbutton0;
    	let t2;
    	let li2;
    	let iconbutton1;
    	let t3;
    	let li3;
    	let iconbutton2;
    	let t4;
    	let li4;
    	let dropdownbutton;
    	let current;

    	iconbutton0 = new IconButton({
    			props: { id: "bars", size: "sm" },
    			$$inline: true
    		});

    	iconbutton0.$on("click", /*click_handler*/ ctx[1]);

    	iconbutton1 = new IconButton({
    			props: { id: "question" },
    			$$inline: true
    		});

    	iconbutton2 = new IconButton({ props: { id: "bell" }, $$inline: true });

    	dropdownbutton = new DropdownButton({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Controller";
    			t1 = space();
    			li1 = element("li");
    			create_component(iconbutton0.$$.fragment);
    			t2 = space();
    			li2 = element("li");
    			create_component(iconbutton1.$$.fragment);
    			t3 = space();
    			li3 = element("li");
    			create_component(iconbutton2.$$.fragment);
    			t4 = space();
    			li4 = element("li");
    			create_component(dropdownbutton.$$.fragment);
    			attr_dev(li0, "class", "logo svelte-91646e");
    			add_location(li0, file$4, 9, 8, 254);
    			attr_dev(li1, "class", "enclosed svelte-91646e");
    			add_location(li1, file$4, 12, 8, 317);
    			attr_dev(li2, "class", "svelte-91646e");
    			add_location(li2, file$4, 15, 8, 456);
    			attr_dev(li3, "class", "svelte-91646e");
    			add_location(li3, file$4, 18, 8, 524);
    			attr_dev(li4, "class", "svelte-91646e");
    			add_location(li4, file$4, 21, 8, 588);
    			attr_dev(ul, "class", "svelte-91646e");
    			add_location(ul, file$4, 8, 4, 241);
    			attr_dev(nav, "class", "svelte-91646e");
    			add_location(nav, file$4, 7, 0, 231);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			mount_component(iconbutton0, li1, null);
    			append_dev(ul, t2);
    			append_dev(ul, li2);
    			mount_component(iconbutton1, li2, null);
    			append_dev(ul, t3);
    			append_dev(ul, li3);
    			mount_component(iconbutton2, li3, null);
    			append_dev(ul, t4);
    			append_dev(ul, li4);
    			mount_component(dropdownbutton, li4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dropdownbutton_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				dropdownbutton_changes.$$scope = { dirty, ctx };
    			}

    			dropdownbutton.$set(dropdownbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbutton0.$$.fragment, local);
    			transition_in(iconbutton1.$$.fragment, local);
    			transition_in(iconbutton2.$$.fragment, local);
    			transition_in(dropdownbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbutton0.$$.fragment, local);
    			transition_out(iconbutton1.$$.fragment, local);
    			transition_out(iconbutton2.$$.fragment, local);
    			transition_out(dropdownbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(iconbutton0);
    			destroy_component(iconbutton1);
    			destroy_component(iconbutton2);
    			destroy_component(dropdownbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $sidenavOpen;
    	validate_store(sidenavOpen, 'sidenavOpen');
    	component_subscribe($$self, sidenavOpen, $$value => $$invalidate(0, $sidenavOpen = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		set_store_value(sidenavOpen, $sidenavOpen = !$sidenavOpen, $sidenavOpen);
    	};

    	$$self.$capture_state = () => ({
    		DropdownButton,
    		IconButton,
    		sidenavOpen,
    		$sidenavOpen
    	});

    	return [$sidenavOpen, click_handler];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/layout/Sidenav.svelte generated by Svelte v3.46.4 */
    const file$3 = "src/components/layout/Sidenav.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (15:8) {#each pageList as page}
    function create_each_block$1(ctx) {
    	let li;
    	let div;
    	let icon;
    	let span;
    	let t0_value = /*page*/ ctx[2].label + "";
    	let t0;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { id: /*page*/ ctx[2].icon },
    			$$inline: true
    		});

    	function click_handler() {
    		return /*click_handler*/ ctx[1](/*page*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			create_component(icon.$$.fragment);
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "icon svelte-xw35vt");
    			add_location(div, file$3, 16, 12, 483);
    			add_location(span, file$3, 16, 59, 530);
    			attr_dev(li, "class", "svelte-xw35vt");
    			toggle_class(li, "active", /*$currentPageId*/ ctx[0] == /*page*/ ctx[2].id);
    			add_location(li, file$3, 15, 8, 379);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			mount_component(icon, div, null);
    			append_dev(li, span);
    			append_dev(span, t0);
    			append_dev(li, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$currentPageId, pageList*/ 1) {
    				toggle_class(li, "active", /*$currentPageId*/ ctx[0] == /*page*/ ctx[2].id);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(15:8) {#each pageList as page}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let nav;
    	let ul;
    	let div;
    	let t1;
    	let nav_intro;
    	let current;
    	let each_value = pageList;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			div = element("div");
    			div.textContent = "Controller";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "logo svelte-xw35vt");
    			add_location(div, file$3, 11, 8, 281);
    			attr_dev(ul, "class", "svelte-xw35vt");
    			add_location(ul, file$3, 10, 4, 268);
    			attr_dev(nav, "class", "svelte-xw35vt");
    			add_location(nav, file$3, 9, 0, 240);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);
    			append_dev(ul, div);
    			append_dev(ul, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$currentPageId, pageList*/ 1) {
    				each_value = pageList;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			if (!nav_intro) {
    				add_render_callback(() => {
    					nav_intro = create_in_transition(nav, fly, { x: -200 });
    					nav_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $currentPageId;
    	validate_store(currentPageId, 'currentPageId');
    	component_subscribe($$self, currentPageId, $$value => $$invalidate(0, $currentPageId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sidenav', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sidenav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = page => {
    		set_store_value(currentPageId, $currentPageId = page.id, $currentPageId);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		fly,
    		pageList,
    		currentPageId,
    		$currentPageId
    	});

    	return [$currentPageId, click_handler];
    }

    class Sidenav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidenav",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/layout/Layout.svelte generated by Svelte v3.46.4 */
    const file$2 = "src/components/layout/Layout.svelte";

    // (12:0) {#if $sidenavOpen}
    function create_if_block$1(ctx) {
    	let sidenav;
    	let current;
    	sidenav = new Sidenav({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sidenav.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidenav, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidenav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidenav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidenav, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(12:0) {#if $sidenavOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let header;
    	let t0;
    	let div;
    	let t1;
    	let if_block_anchor;
    	let current;
    	header = new Header({ $$inline: true });
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let if_block = /*$sidenavOpen*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "content svelte-317ivz");
    			toggle_class(div, "compressed", /*$sidenavOpen*/ ctx[0]);
    			add_location(div, file$2, 8, 0, 179);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*$sidenavOpen*/ 1) {
    				toggle_class(div, "compressed", /*$sidenavOpen*/ ctx[0]);
    			}

    			if (/*$sidenavOpen*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*$sidenavOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $sidenavOpen;
    	validate_store(sidenavOpen, 'sidenavOpen');
    	component_subscribe($$self, sidenavOpen, $$value => $$invalidate(0, $sidenavOpen = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Layout', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		sidenavOpen,
    		Header,
    		Sidenav,
    		$sidenavOpen
    	});

    	return [$sidenavOpen, $$scope, slots];
    }

    class Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/pages/auth/Login.svelte generated by Svelte v3.46.4 */
    const file$1 = "src/pages/auth/Login.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let form;
    	let inputfield0;
    	let updating_value;
    	let t2;
    	let inputfield1;
    	let updating_value_1;
    	let t3;
    	let span;
    	let t4;
    	let t5;
    	let input;
    	let current;
    	let mounted;
    	let dispose;

    	function inputfield0_value_binding(value) {
    		/*inputfield0_value_binding*/ ctx[5](value);
    	}

    	let inputfield0_props = { title: "Username" };

    	if (/*username*/ ctx[0] !== void 0) {
    		inputfield0_props.value = /*username*/ ctx[0];
    	}

    	inputfield0 = new InputField({ props: inputfield0_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputfield0, 'value', inputfield0_value_binding));
    	inputfield0.$on("change", /*resetError*/ ctx[4]);

    	function inputfield1_value_binding(value) {
    		/*inputfield1_value_binding*/ ctx[6](value);
    	}

    	let inputfield1_props = { title: "Password" };

    	if (/*password*/ ctx[1] !== void 0) {
    		inputfield1_props.value = /*password*/ ctx[1];
    	}

    	inputfield1 = new InputField({ props: inputfield1_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputfield1, 'value', inputfield1_value_binding));
    	inputfield1.$on("change", /*resetError*/ ctx[4]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Controller";
    			t1 = space();
    			form = element("form");
    			create_component(inputfield0.$$.fragment);
    			t2 = space();
    			create_component(inputfield1.$$.fragment);
    			t3 = space();
    			span = element("span");
    			t4 = text(/*error*/ ctx[2]);
    			t5 = space();
    			input = element("input");
    			attr_dev(div0, "class", "logo svelte-1slq5at");
    			add_location(div0, file$1, 16, 4, 357);
    			attr_dev(span, "class", "svelte-1slq5at");
    			add_location(span, file$1, 22, 8, 629);
    			attr_dev(input, "type", "submit");
    			input.value = "Login";
    			attr_dev(input, "class", "svelte-1slq5at");
    			add_location(input, file$1, 23, 8, 658);
    			attr_dev(form, "class", "svelte-1slq5at");
    			add_location(form, file$1, 19, 4, 410);
    			attr_dev(div1, "class", "login svelte-1slq5at");
    			add_location(div1, file$1, 15, 0, 333);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, form);
    			mount_component(inputfield0, form, null);
    			append_dev(form, t2);
    			mount_component(inputfield1, form, null);
    			append_dev(form, t3);
    			append_dev(form, span);
    			append_dev(span, t4);
    			append_dev(form, t5);
    			append_dev(form, input);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit*/ ctx[3]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const inputfield0_changes = {};

    			if (!updating_value && dirty & /*username*/ 1) {
    				updating_value = true;
    				inputfield0_changes.value = /*username*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputfield0.$set(inputfield0_changes);
    			const inputfield1_changes = {};

    			if (!updating_value_1 && dirty & /*password*/ 2) {
    				updating_value_1 = true;
    				inputfield1_changes.value = /*password*/ ctx[1];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			inputfield1.$set(inputfield1_changes);
    			if (!current || dirty & /*error*/ 4) set_data_dev(t4, /*error*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputfield0.$$.fragment, local);
    			transition_in(inputfield1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputfield0.$$.fragment, local);
    			transition_out(inputfield1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(inputfield0);
    			destroy_component(inputfield1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let username, password;
    	let error = "";

    	const submit = async () => {
    		$$invalidate(2, error = await login(username, password));
    	};

    	const resetError = () => {
    		$$invalidate(2, error = "");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function inputfield0_value_binding(value) {
    		username = value;
    		$$invalidate(0, username);
    	}

    	function inputfield1_value_binding(value) {
    		password = value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		InputField,
    		login,
    		username,
    		password,
    		error,
    		submit,
    		resetError
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    		if ('error' in $$props) $$invalidate(2, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		username,
    		password,
    		error,
    		submit,
    		resetError,
    		inputfield0_value_binding,
    		inputfield1_value_binding
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/controllers/Router.svelte generated by Svelte v3.46.4 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (18:0) {:else}
    function create_else_block(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(18:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:0) {#if $token}
    function create_if_block(ctx) {
    	let layout;
    	let current;

    	layout = new Layout({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layout.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layout_changes = {};

    			if (dirty & /*$$scope, $currentPageId*/ 34) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(10:0) {#if $token}",
    		ctx
    	});

    	return block;
    }

    // (13:12) {#if $currentPageId == page.id}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*page*/ ctx[2].component;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*page*/ ctx[2].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(13:12) {#if $currentPageId == page.id}",
    		ctx
    	});

    	return block;
    }

    // (12:8) {#each pageList as page}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$currentPageId*/ ctx[1] == /*page*/ ctx[2].id && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$currentPageId*/ ctx[1] == /*page*/ ctx[2].id) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$currentPageId*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(12:8) {#each pageList as page}",
    		ctx
    	});

    	return block;
    }

    // (11:4) <Layout>
    function create_default_slot(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = pageList;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pageList, $currentPageId*/ 2) {
    				each_value = pageList;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(11:4) <Layout>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$token*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $token;
    	let $currentPageId;
    	validate_store(token, 'token');
    	component_subscribe($$self, token, $$value => $$invalidate(0, $token = $$value));
    	validate_store(currentPageId, 'currentPageId');
    	component_subscribe($$self, currentPageId, $$value => $$invalidate(1, $currentPageId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		pageList,
    		token,
    		currentPageId,
    		Layout,
    		Login,
    		$token,
    		$currentPageId
    	});

    	return [$token, $currentPageId];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;
    	router = new Router({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			add_location(main, file, 4, 0, 82);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
