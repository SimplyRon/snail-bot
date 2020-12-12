client.on('roleCreate', nrole => { events.rolecreate(nrole, client) });

client.on('roleDelete', orole => { events.roledelete(orole, client) });

client.on('channelCreate', nchannel => { events.channelcreated(nchannel, client) });

client.on('channelDelete', ochannel => { events.channeldeleted(ochannel, client) });