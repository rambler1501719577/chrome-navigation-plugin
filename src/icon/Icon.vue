<template>
    <svg class="rambler-icon" aria-hidden="true"><use :xlink:href="icon"></use></svg>
</template>

<script>
export default {
    name: 'Icon',
    props: {
        name: {
            type: String,
            required: true
        }
    },
    computed: {
        icon: function() {
            return '#icon-' + this.name;
        }
    }
};
</script>

<style>
.rambler-icon {
    width: 1em;
    height: 1em;
    overflow: hidden;
}
</style>
