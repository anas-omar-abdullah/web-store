<template>
<div>
    <advertisement/>
    <navbar /> 
    <slot /> 
    <footer-p />
</div>
</template>
<script>
export default {
    head(){
        const routeName = this.$route.name;
        return routeName;
    }
}
</script>