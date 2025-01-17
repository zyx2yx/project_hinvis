const colorConfig = {
    Domain:'rgb(3, 251, 251)',
    IP:"rgb(241, 222, 29)",
    Cert:'rgb(254, 120, 7)',
    Whois_Name:'rgb(47, 166, 254)',
    Whois_Phone:'rgb(47, 166, 254)',
    Whois_Email:'rgb(47, 166, 254)',
    ASN:'rgb(165, 73, 185)',
    IP_C:'rgb(165, 73, 185)',
    '核心资产': 'rgb(241, 98, 132)',
}

const HINColorConfig = [
    {nodetype: 'Domain', color: 'rgb(3, 251, 251)'},
    {nodetype: 'IP', color: 'rgb(241, 222, 29)'},
    {nodetype: 'Cert', color: 'rgb(254, 120, 7)'},
    {nodetype: 'Whois_Name', color: 'rgb(47, 166, 254)'},
    {nodetype: 'Whois_Phone', color: 'rgb(47, 166, 254)'},
    {nodetype: 'Whois_Email', color: 'rgb(47, 166, 254)'},
    {nodetype: 'ASN', color: 'rgb(165, 73, 185)'},
    {nodetype: 'IP_C', color: 'rgb(165, 73, 185)'},
    {nodetype: '选中节点', color: 'rgb(241, 98, 132)'},
]
const HINEdgeColorConfig = [
    {edgetype: 'subdomain', color: '#34b3f1'},
    {edgetype: 'cert', color: '#fe7469'},
    {edgetype: 'request_jump', color: '#232e9a'},
    {edgetype: 'dns_a', color: '#33a02c'},
    {edgetype: 'whois', color: '#f67f02'},
    {edgetype: 'cert_chain', color: '#f9b4ae'},
    {edgetype: 'cname', color: '#baabda'},
    {edgetype: 'asn', color: '#f9bf6f'},
    {edgetype: 'cidr', color: '#7fc97f'},
]
export {colorConfig, HINColorConfig, HINEdgeColorConfig}