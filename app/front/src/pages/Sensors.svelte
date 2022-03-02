<script>
    import {fly} from 'svelte/transition';
</script>
    
    
<div class="window">
    <div class="header spaced">
        <div class="header-title">
            Clima Interior
        </div>
        <div class="header-action">
            xx
        </div>
    </div>
    <div class="section">
        <h3>Temperatura<span class="badge">26C</span></h3>
        Temperatura interior esta en rango optimo.
        <div class="progress"></div>
    </div>
    <hr class="divider">
    <div class="section">
        <h3>Humedad<span class="badge">68%</span></h3>
        Humedad interior esta en rango optimo.
        <div class="progress"></div>
    </div>
    <div class="header">
        <div class="header-title">
            Last 24 Hours
        </div>
    </div>
</div>

<div class="window">
    <div class="header">
        <div class="header-title">
            Clima Exterior
        </div>
    </div>
    <div class="section">
        <h3>Temperatura<span class="badge">19C</span></h3>
        Temperatura exterior esta baja.
        <div class="progress"></div>
    </div>
    <hr class="divider">
    <div class="section">
        <h3>Humedad<span class="badge">82%</span></h3>
        Humedad exterior esta alta.
        <div class="progress"></div>
    </div>
</div>


<style>
    .window {
        background-color: #242a2f;
        border-radius: 10px;
        overflow: hidden;
        color: #656c75;
        margin: 20px 0;
        padding-bottom: 5px;
        transition: all 2s;
    }

    .header {

    padding: 8px 15px;
    background-color: #292f33;
    }

    .header-title {
        font-size: 0.8rem;
        text-align: left;
    }

    .header-action {
        font-size: 0.8rem;
        text-align: left;
    }

    .section {
        margin: 10px 15px;
        font-size: 0.75rem;
    }

    .spaced {
        display: flex;
        justify-content: space-between;
    }

    .badge {
        margin-left: 5px;
        padding: 2px 4px;
        color: #656c75;
        font-size: 0.65rem;
        font-weight: 500;
        background-color: #373b40;
        border-radius: 5px;
    }

    .divider {
        margin: 15px;
        border: none;
        border-top: 1px solid #292f33;
    }

    .progress {
        height: 2px;
        margin: 8px 0;
        background: linear-gradient(90deg, rgba(0,86,212,1) 0%, rgba(8,212,0,1) 50%, rgba(212,0,0,1) 100%);
    }

    h3 {
        font-size: 0.75rem;
        margin: 5px 0;
        color: #fffffff1;
        flex-basis: 50%;
    }
</style>